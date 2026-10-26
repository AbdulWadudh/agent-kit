#!/usr/bin/env bash
set -e

COMMAND=$1
TASK_SLUG=$2
DATE=$(date +%Y-%m-%d)
MONTH=$(date +%Y-%m)

TASKS_DIR=".agents/tasks"
COUNTER_FILE="$TASKS_DIR/.counter"
ACTIVE_DIR="$TASKS_DIR/active"
ARCHIVE_DIR="$TASKS_DIR/archive/$MONTH"

if [ ! -f "$COUNTER_FILE" ]; then
  echo "100" > "$COUNTER_FILE"
fi

case $COMMAND in
  check)
    ACTIVE_FILE=$(ls "$ACTIVE_DIR"/*.md 2>/dev/null | grep -v gitkeep | head -n 1)
    if [ -n "$ACTIVE_FILE" ]; then
      echo "EXISTS:$ACTIVE_FILE"
    else
      echo "NONE"
    fi
    ;;

  new)
    if [ -z "$TASK_SLUG" ]; then
      echo "Usage: ./.agents/driver/task.sh new <task-slug>"
      exit 1
    fi
    
    LAST_ID=$(cat "$COUNTER_FILE")
    NEXT_ID=$((LAST_ID + 1))
    echo "$NEXT_ID" > "$COUNTER_FILE"
    
    TASK_ID="TASK-${NEXT_ID}"
    FILE_NAME="${DATE}-${TASK_ID}-${TASK_SLUG}.md"
    FILE_PATH="$ACTIVE_DIR/$FILE_NAME"
    
    mkdir -p "$ACTIVE_DIR"
    cp "$TASKS_DIR/templates/task-template.md" "$FILE_PATH"
    sed -i "s/TASK-ID-PLACEHOLDER/$TASK_ID/g" "$FILE_PATH"
    
    echo "Created active task [$TASK_ID]: $FILE_PATH"
    ;;

  complete)
    echo "1. Running post-task verification checks..."
    ./.agents/driver/verify_task.sh
    
    ACTIVE_FILE=$(ls "$ACTIVE_DIR"/*.md 2>/dev/null | grep -v gitkeep | head -n 1)
    
    if [ -n "$ACTIVE_FILE" ]; then
      mkdir -p "$ARCHIVE_DIR"
      mv "$ACTIVE_FILE" "$ARCHIVE_DIR/"
      echo "2. Task compressed & archived to: $ARCHIVE_DIR/"
      echo "3. Remember to clear Active Task pointer in $TASKS_DIR/INDEX.md!"
    else
      echo "No active task found to archive."
    fi
    ;;

  *)
    echo "Usage: ./.agents/driver/task.sh [check|new|complete]"
    ;;
esac
