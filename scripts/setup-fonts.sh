#!/bin/bash
# PDF Guide - Font Setup Script
# Run this after cloning the project to download required fonts.

FONTS_DIR="scripts/fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading fonts..."

# Inter (variable)
echo "  - Inter..."
curl -sL "https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip" -o /tmp/inter.zip
unzip -qo /tmp/inter.zip "InterVariable.ttf" "InterVariable-Italic.ttf" -d "$FONTS_DIR"
mv "$FONTS_DIR/InterVariable.ttf" "$FONTS_DIR/inter.ttf" 2>/dev/null
mv "$FONTS_DIR/InterVariable-Italic.ttf" "$FONTS_DIR/inter-italic.ttf" 2>/dev/null
rm -f /tmp/inter.zip

# JetBrains Mono
echo "  - JetBrains Mono..."
curl -sL "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip" -o /tmp/jbmono.zip
unzip -qo /tmp/jbmono.zip "fonts/ttf/JetBrainsMono-Regular.ttf" "fonts/ttf/JetBrainsMono-Bold.ttf" -d /tmp/jbmono
mv /tmp/jbmono/fonts/ttf/JetBrainsMono-Regular.ttf "$FONTS_DIR/jetbrains-mono.ttf"
mv /tmp/jbmono/fonts/ttf/JetBrainsMono-Bold.ttf "$FONTS_DIR/jetbrains-mono-bold.ttf"
rm -rf /tmp/jbmono /tmp/jbmono.zip

# General Sans (from Fontshare)
echo "  - General Sans..."
curl -sL "https://api.fontshare.com/v2/fonts/download/general-sans" -o /tmp/general-sans.zip
unzip -qo /tmp/general-sans.zip "GeneralSans_Complete/Fonts/TTF/GeneralSans-Variable.ttf" -d /tmp/gs
mv "/tmp/gs/GeneralSans_Complete/Fonts/TTF/GeneralSans-Variable.ttf" "$FONTS_DIR/general-sans.ttf"
rm -rf /tmp/gs /tmp/general-sans.zip

echo ""
echo "Done! Fonts installed to $FONTS_DIR:"
ls -la "$FONTS_DIR"/*.ttf
