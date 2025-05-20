#!/bin/bash
#Usage: ./name.sh /path/to/your/file.zip

# Check if exactly 3 files are at the root level (video, json, frame image)
check_zip_structure() {
    local zip_file=$1
    unzip_output=$(unzip -l "$zip_file")
	num_files=$(echo "$unzip_output" | grep -E '^\s+[0-9]+\s+[0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}\s+[^/]+\s*$' | wc -l)    
    if [ "$num_files" -ne 3 ]; then
        echo "Error: Zip file $zip_file does not contain exactly 3 files at the root level"
        exit 1
    fi
}

#Read the video id from the action map json
extract_info_from_json() {
    local json_file="$1"
    VIDEO_ID=$(jq -r '.metadata.id' "$json_file")

    if [ -z "$VIDEO_ID" ]; then
        echo "Error: Failed to extract video_id or filename from $json_file"
        exit 1
    fi
}


#Check if the params has zip file
if [ $# -ne 1 ]; then
    echo "Usage: $0 <zip_file>"
    exit 1
fi

ZIP_FILE="$1"
#Make sure zip file is real and correct
if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: Zip file $ZIP_FILE not found"
    exit 1
fi
check_zip_structure "$ZIP_FILE"

#Extract video id (need to unzip and put in temp folder)
TEMP_DIR="extracted"
mkdir -p "$TEMP_DIR"
unzip -q "$ZIP_FILE" -d "$TEMP_DIR"
if [ $? -ne 0 ]; then
    echo "Error: Failed to unzip $ZIP_FILE"
    exit 1
fi

#Read from json
JSON_FILE="$TEMP_DIR/action_map.json"
extract_info_from_json "$JSON_FILE"


#VIDEO_DIR = os.path.join(os.getcwd(), '../data') - from raiv/server
#path = os.path.join(VIDEO_DIR, api_key, video_id, filename)
VIDEO_DIR="$(pwd)/data"
API_KEY="" 
PATH=$VIDEO_DIR/$API_KEY/$VIDEO_ID/

#Scp call
REMOTE_USER="" 
REMOTE_HOST="" 
scp -r "$TEMP_DIR" "$REMOTE_USER"@"$REMOTE_HOST":"$PATH"

#If scp is not installed and you're in the RAIV directory, makes new folder and copies files into it
#if [ ! -d "$PATH" ]; then
#    /bin/mkdir -p "$PATH"
#fi
#/bin/cp "$TEMP_DIR/video.mp4" "$PATH"
#/bin/cp "$TEMP_DIR/action_map.json" "$PATH"
#/bin/cp "$TEMP_DIR/first_frame.png" "$PATH"

/bin/rm -rf "$TEMP_DIR"