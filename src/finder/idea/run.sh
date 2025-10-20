finderPath=`osascript -e 'tell application "Finder" to get the POSIX path of (target of front window as alias)'`
IDEA=`find "$HOME/Applications/" -name idea`
if [ -z "$IDEA" ]
then
IDEA=`find "/Users/ludoo/Library/Application Support/JetBrains/" -name idea`
fi
echo "Open IntelliJ...  $IDEA"
open -a "$IDEA" "$finderPath"