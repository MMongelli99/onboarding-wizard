#!/usr/bin/env zsh
function redeploy() {
    # deploy most recent commit if not provided
    COMMIT=${1:-$(git rev-parse --short HEAD)}
    echo "Deploying commit $COMMIT to fronted..."; \
    render deploys create $FRONTEND_SERVICE_ID \
      --commit "$COMMIT" \
      --output json \
      --confirm; echo &
    echo "Deploying commit $COMMIT to backend..."; \
    render deploys create $BACKEND_SERVICE_ID \
      --commit "$COMMIT" \
      --output json \
      --confirm; echo &
    wait
}
redeploy "$1"
