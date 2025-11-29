#!/usr/bin/env bash
set -e

echo "running precommit hooks..."

make fmt-all

echo "Done!"