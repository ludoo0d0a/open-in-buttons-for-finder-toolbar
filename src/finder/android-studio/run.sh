finderPath=`osascript -e 'tell application "Finder" to get the POSIX path of (target of front window as alias)'`
#In Studio, Tools/Create command line launcher to get this script
STUDIO="/usr/local/bin/studio"
VERSION=2
if [ -e "$STUDIO" ]
then
  echo "Open AndroidStudio...  $STUDIO"
  echo "$VERSION - open script : \"$STUDIO\" \"$finderPath\"" &gt; ~/androidstudio.log
  "$STUDIO" "$finderPath"
else
  STUDIO=`find "$HOME/Applications/" -name "Android Studio.app" | tail -n1`
  echo "Open AndroidStudio...  $STUDIO"
  echo "$VERSION - open app: open -a \"$STUDIO\" \"$finderPath\"" &gt; ~/androidstudio.log
  open -a "$STUDIO" "$finderPath"
fi