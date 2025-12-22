#!/usr/bin/env bash
set -e

GO_PATH="$HOME/go/go1.24.11.linux-amd64/bin"
BUN_PATH="$HOME/.bun/bin"
TASK="/usr/bin/go-task"

export PATH=$BUN_PATH:$GO_PATH:$PATH

echo "running precommit hooks..."


$TASK fmt-all

echo "Done!"