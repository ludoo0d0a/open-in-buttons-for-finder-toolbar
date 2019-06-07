IDEA=`find "$HOME/Applications/" -name idea`
if [ -z "$IDEA" ]
then
IDEA=`find "/Users/ludoo/Library/Application Support/JetBrains/" -name idea`
fi
echo "Open IntelliJ...  $IDEA"