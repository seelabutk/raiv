import json
import argparse

'''
Minified Action Map playback Spec:

Root: {
    name: String, 
    metadata: Object, 
    independentActions: [], 
    tags: String,
    root: Node
}

Node: {
    type: ['click' | 'hover' | 'slider' | 'toggle' | 'toggle-off'],
    boundingBox: [x1, y1, x2, y2],
    frameCount: integer,
    position: integer,
    [disableSiblings]: bool - default false,
    [independent]: bool - default false
    children: [...Node...]
}
'''


def v0_0_1Tov0_0_2(v0_0_1_AM):
    if 'version' in v0_0_1_AM and v0_0_1_AM['version'] != '0.0.1':
        return v0_0_1_AM

    allowedAttributes = [
        'type',
        'boundingBox',
        'position'
    ]
    defaultAttributes = {
        'disableSiblings': False,
        'independent': False,
    }
    renameAttributes = {
        'position': 'ID'
    }

    v0_0_2_AM = filterNode(v0_0_1_AM, ['name', 'metadata', 'independentActions', 'tags'])
    v0_0_2_AM['root'] = dfs(v0_0_1_AM, lambda n: filterNode(n, allowedAttributes, defaultAttributes, renameAttributes))
    v0_0_2_AM['root']['type'] = 'root'
    v0_0_2_AM['version'] = '0.0.2'

    return v0_0_2_AM

versionData = {
  '0.0.1': {
    'date_added': '05/05/2023', #idk, made something up
    'description': 'The original RAIV file format',
    'changelog': ['created RAIV file format'],
    'upgradeFunction': v0_0_1Tov0_0_2,
    'nextVersion': '0.0.2',
  },
  '0.0.2': {
    'date_added': '02/05/24',
    'description': 'minified RAIV object which separates recording and playback attributes',
    'changelog': [
      'changed "position" attribute to "ID"',
      'removed all attributes except type, boundingBox, ID, disableSiblings, and independent',
      'introudced "default values", where if an attributes value is equal to the default value, the attribute is removed and the default value is assumed',
      'made "disableSiblings" and "independent" attributes default to false',
      'if no children are present, deleted the children attribute instead of making an empty array'
    ],
    'upgradeFunction': None,
    'nextVersion': None,
  }
}

def getActionMap(fileName):
    with open(fileName, 'r') as f:
        data = json.load(f)
        return data
    
def saveActionMap(fileName, data):
  with open(fileName, 'w') as f:
     json.dump(data, f)

def dfs(node, cb = lambda n: n):
  newNode = cb(node) or node
  if 'children' in node and node['children']:
    newNode['children'] = list(map(lambda child: dfs(child, cb), node['children']))
  return newNode

def filterNode(node, allowedAttributes = [], defaultAttributes = {}, renameAttributes = {}):
  
  def do_filter(key, value):
    if key in defaultAttributes and defaultAttributes[key] != value:
       return [key, value]
    elif key in renameAttributes:
       return [renameAttributes[key], value]
    elif key in allowedAttributes:
       return [key, value]
    return ['delete', 'delete']
  
  newNode = dict(map(lambda x: do_filter(*x), node.items()))
  del newNode['delete']
  return newNode




def convertToLatest(obj):
  convertedObj = obj
  version = obj.get('version', '0.0.1')
  cver = versionData[version]
  while cver['nextVersion'] != None:
    upgradeFunction = cver['upgradeFunction']
    convertedObj = upgradeFunction(convertedObj)
    cver = versionData[cver['nextVersion']]
  return convertedObj


def getLatestVersion():
  version = list(versionData.keys())[-1]
  while versionData[version]['nextVersion'] != None:
      version = versionData[version]['nextVersion']
  return version

def main(infile, outfile):
  AM = getActionMap(infile)
  latest_AM = convertToLatest(AM)
  saveActionMap(outfile, latest_AM)
  
  
def cli():
  parser = argparse.ArgumentParser()
  parser.add_argument('file', metavar='i')
  parser.add_argument('ofile', metavar='o')
  return parser.parse_args()
  
if __name__ == "__main__":
  args = list(vars(cli()).values())
  main(*args)