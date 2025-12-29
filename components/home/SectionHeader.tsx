import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { homeStyles } from "@/styles/homeStyles";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({ title, subtitle, actionLabel, onActionPress }: Props) {
  const hasAction = Boolean(actionLabel && onActionPress);

  return (
    <View style={hasAction ? homeStyles.sectionHeaderRow : homeStyles.sectionHeader}>
      <View>
        <Text style={homeStyles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={homeStyles.sectionHint}>{subtitle}</Text> : null}
      </View>

      {hasAction ? (
        <TouchableOpacity onPress={onActionPress} accessibilityLabel={actionLabel}>
          <Text style={homeStyles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
