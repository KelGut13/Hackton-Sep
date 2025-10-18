import React, { useState } from 'react';
import GlobalAccessibilityButton from './GlobalAccessibilityButton';
import AccessibilityMenu from './AccessibilityMenu';

export default function AccessibilitySystem() {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  return (
    <>
      <GlobalAccessibilityButton 
        onPress={() => setShowAccessibilityMenu(true)} 
      />
      <AccessibilityMenu 
        visible={showAccessibilityMenu}
        onClose={() => setShowAccessibilityMenu(false)}
      />
    </>
  );
}