/**
 * Settings Screen
 *
 * App settings: theme, language, about
 *
 * @package @news-app/mobile
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAppStore } from '../store/useAppStore';
import { SUPPORTED_LOCALES, type Locale } from '@news-app/i18n';
import { spacing, borderRadius, fonts } from '../theme';

const LOCALE_NAMES: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingRow({ label, value, onPress, rightElement }: SettingRowProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      {rightElement || (
        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
          {value}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const locale = useAppStore((state) => state.locale);
  const setLocale = useAppStore((state) => state.setLocale);
  const savedArticles = useAppStore((state) => state.savedArticles);

  const [showLanguages, setShowLanguages] = React.useState(false);

  const handleThemeToggle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return "🌙 Qorong'i";
      case 'light':
        return "☀️ Yorug'";
      default:
        return '📱 Sistema';
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          ⚙️ Sozlamalar
        </Text>
      </View>

      {/* Appearance */}
      <SettingSection title="TASHQI KO'RINISH">
        <SettingRow
          label="Mavzu"
          value={getThemeLabel()}
          onPress={handleThemeToggle}
        />
      </SettingSection>

      {/* Language */}
      <SettingSection title="TIL">
        <SettingRow
          label="Ilova tili"
          value={LOCALE_NAMES[locale]}
          onPress={() => setShowLanguages(!showLanguages)}
        />
        {showLanguages && (
          <View style={styles.languageOptions}>
            {SUPPORTED_LOCALES.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.languageOption,
                  locale === loc && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => {
                  setLocale(loc);
                  setShowLanguages(false);
                }}
              >
                <Text
                  style={[
                    styles.languageText,
                    { color: locale === loc ? colors.primary : colors.text },
                  ]}
                >
                  {LOCALE_NAMES[loc]}
                </Text>
                {locale === loc && (
                  <Text style={{ color: colors.primary }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SettingSection>

      {/* Data */}
      <SettingSection title="MA'LUMOTLAR">
        <SettingRow
          label="Saqlangan maqolalar"
          value={`${savedArticles.length} ta`}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="ILOVA HAQIDA">
        <SettingRow label="Versiya" value="1.0.0" />
        <SettingRow label="Ishlab chiqaruvchi" value="News App Team" />
      </SettingSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: '700',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  sectionContent: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLabel: {
    fontSize: fonts.sizes.base,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: fonts.sizes.base,
  },
  languageOptions: {
    paddingVertical: spacing.sm,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  languageText: {
    fontSize: fonts.sizes.base,
  },
});
