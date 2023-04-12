#!/usr/bin/env bash

# Exit immediately after command fails
set -e

# Treat unset variables as errors
set -u

# Settings
SERVER_PORT=8088

## Logging defaults
LOGGING__DEBUG=false
LOGGING__SILENT=false

## Tmux settings
SESSION_NAME=RAIV
PROJECT_HOME=$PWD

## Script options
KILL_LAST_SESSION=false
UPDATE_PACKAGES=false

# Define pipenv because sometimes it should be invoked in an unexpected way.
PIPENV_BIN="$(which pipenv)"

is_number() {
	[[ $1 =~ ^[+-]?[0-9]+$ ]]
	return $?
}

usage() {
	local is_error=false
	for arg in "$@"
	do
		case "$arg" in
			-e|--error) is_error=true; break;;
			*) break;;
		esac
	done

	local usage="Usage: $(basename $0) [OPTIONS]\n"
	usage+='Start all background services to run a local instance of RAIV'
	usage+=', setup tmux\nto control the background services and attach to'
	usage+=' that tmux session.\n'
	usage+='\nOptions:\n'
	usage+='  --kill-session          Kill existing tmux session.\n'
	usage+='  -u, --update-packages   Update yarn packages.\n'
	usage+='  -h, --help              Display this message and exit.\n'
	usage+='  -s, --silent            Suppress error messages.\n'
	usage+='  -v, --verbose           Enable verbose logging.\n\n'

	if $is_error
	then
		printf "$usage" 1>&2
	else
		printf "$usage"
	fi
}

LOGGING__LOG() {
	local level="$1"
	shift

	if ! $LOGGING__SILENT
	then
		printf '%(%FT%H:%M:%S%z)T %s:' -1 $level

		for arg in $@
		do
			printf ' %s' $arg
		done

		printf '\n'
	fi
}

log() {
	LOGGING__LOG "  LOG" "$@"
}

debug() {
	if $LOGGING__DEBUG
	then
		LOGGING__LOG DEBUG "$@"
	fi
}

error() {
	local should_exit=false
	if is_number "$1"
	then
		should_exit=true
		local return_code="$1"
		shift
	fi

	LOGGING__LOG ERROR "$@"

	if $should_exit
	then
		exit $return_code
	fi
}

# tmux related functions
tmux__new_window() {
	# Required argument: window_name
	local window_name="$1"
	shift

	# Optional argument: directory
	# Must be an absolute path
	local directory=''
	if [ $# -gt 0 ] && [ -d "$1" ] && [ "${1:0:1}" = '/' ]
	then
		if [ -r "$1" ]
		then
			directory="$1"
			shift
		else
			error 2 "Directory \"$directory\" is not readable to you."
		fi
	fi

	# Optional argument: location
	local location=''
	if [ $# -gt 0 ] && is_number "$1"
	then
		location="$1"
		shift
	fi

	local new_window__options="-d -n $window_name"

	if [ -n "$directory" ]
	then
		new_window__options+=" -c $directory"
	fi

	if [ -n "$location" ]
	then
		new_window__options+=" -t ${SESSION_NAME}:$location"
	else
		new_window__options+=" -a -t $SESSION_NAME"
	fi

	# debug "tmux new-window $new_window__options"
	tmux new-window $new_window__options

	# Optional arguments: Rest of arguments
	local send_keys__command=''
	for arg in "$@"
	do
		send_keys__command+="$arg "
	done

	if [ -n "$send_keys__command" ]
	then
		# debug "tmux send-keys -t $window_name $send_keys__command ENTER"
		tmux send-keys -t "$window_name" "$send_keys__command" ENTER
	fi
}

# Parse script options
GETOPTIONS=$(getopt -o 'hsvu' --long 'help,silent,verbose,kill-session,update-packages' -n "$(basename $0)" -- "$@")
if [ $? -ne 0 ]
then
	echo Terminating... >&2
	exit 1
fi

eval set -- "$GETOPTIONS"
unset GETOPTIONS

while true
do
	case "$1" in
		--kill-session)
			KILL_LAST_SESSION=true
			shift
			continue
			;;

		-u|--update-packages)
			UPDATE_PACKAGES=true
			shift
			continue
			;;

		-h|--help)
			usage
			exit
			;;

		-s|--silent)
			LOGGING__SILENT=true
			shift
			continue
			;;

		-v|--verbose)
			LOGGING__DEBUG=true
			shift
			continue
			;;

		--)
			shift
			break
			;;

		*)
			usage --error
			exit
			;;
	esac
done

if $LOGGING__SILENT && $LOGGING__DEBUG
then
	error 1 "Silent logging and debug logging are mutually exclusive options. Pick one."
fi

if $UPDATE_PACKAGES
then
	cd $PROJECT_HOME/browser_extension
	yarn install --frozen-lockfile

	cd $PROJECT_HOME/server
	debug $PIPENV_BIN --bare --no-site-packages sync --clear --dev --keep-outdated
	$PIPENV_BIN --bare --no-site-packages sync --clear --dev --keep-outdated

	cd $PROJECT_HOME/server/nuxt
	yarn install --frozen-lockfile

	cd $PROJECT_HOME
fi

# Exit if the session already exists
if tmux has-session -t $SESSION_NAME >/dev/null 2>/dev/null
then
	if $KILL_LAST_SESSION
	then
		debug "Killing old tmux session $SESSION_NAME"
		tmux kill-session -t $SESSION_NAME
	else
		debug "tmux session $SESSION_NAME is already running"
		exit
	fi
fi

# Time for tmux
tmux new-session -d -c "$PROJECT_HOME" -s $SESSION_NAME -n shell

debug "Starting browser extension build watch process"
tmux__new_window extension "$PROJECT_HOME/browser_extension" yarn build-watch

debug "Starting playback client build watch process"
tmux__new_window client "$PROJECT_HOME/server/client" yarn build-watch

debug "Starting server"
tmux__new_window server "$PROJECT_HOME/server" $PIPENV_BIN run uvicorn src.main:app --reload --port $SERVER_PORT

exec tmux attach-session -t $SESSION_NAME
