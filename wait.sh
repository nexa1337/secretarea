while kill -0 $(cat /proc/$(pgrep -f "npm run build")/stat | awk '{print $1}') 2>/dev/null; do sleep 1; done
echo "Build finished"
