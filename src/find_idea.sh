IDEA=`find "$HOME/Applications/" -name idea | tail -n1`
if [ -z "$IDEA" ]
then
IDEA=`find ~/"Library/Application Support/JetBrains/" -name idea | tail -n1`
fi
echo "Open IntelliJ...  $IDEA"