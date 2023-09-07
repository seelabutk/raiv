import re


def cleanActionMapTags(nlp, actionMap):
	# get and clean titles
	raiv_obj_name = cleanTitle(nlp, actionMap.get('name', ''))
	document_title = cleanTitle(nlp, actionMap.get(
		'metadata', {}).get('documentTitle', ''))
	if 'metadata' not in actionMap:
		actionMap['metadata'] = {}
	actionMap['metadata']['documentTitle'] = document_title

	# clean all tags
	def dfs(action):
		# clean action tags
		action['tags'] = cleanData(nlp, action.get('tags', ''))

		# append titles to tags
		action['tags'] = f"{raiv_obj_name} {document_title} {action['tags']}"

		# go thorugh all children
		for child in action.get('children', []):
			dfs(child)
	dfs(actionMap)

	return actionMap


def cleanData(nlp, doc):
	# all text to lower
	doc = doc.lower()

	# remove new lines
	doc = doc.replace('\n', ' ').replace('\r', '')

	# remove punctuation
	doc = re.sub(r'[^\w\s]', ' ', doc)

	# spacy
	doc = nlp(doc)

	# filter tokens
	tokens = [tokens for tokens in doc if (
		# remove urls
		tokens.like_url == False and
		# remove spaces
		tokens.is_space == False and
		# remove emails
		tokens.like_email == False and
		# remove stopwords
		tokens.is_stop == False and
		# remove punctuation
		tokens.is_punct == False and
		# remove digits
		tokens.is_digit == False and
		# remove non-ascii
		tokens.is_ascii == True
	)]

	# lemmatize
	final_token = [token.lemma_ for token in tokens]

	# get only unique tokens
	final_token = list(set(final_token))

	return " ".join(final_token)


def cleanTitle(nlp,  title):
	# all text to lower
	title = title.lower()

	# remove new lines
	title = title.replace('\n', ' ').replace('\r', '')

	# remove punctuation
	title = re.sub(r'[^\w\s]', ' ', title)

	# spacy
	title = nlp(title)

	# filter tokens
	tokens = [tokens for tokens in title if (
		# remove urls
		tokens.like_url == False and
		# remove spaces
		tokens.is_space == False and
		# remove emails
		tokens.like_email == False and
		# remove punctuation
		tokens.is_punct == False and
		# remove digits
		tokens.is_digit == False and
		# remove non-ascii
		tokens.is_ascii == True
	)]

	# lemmatize
	final_token = [token.lemma_ for token in tokens]

	return " ".join(final_token)
