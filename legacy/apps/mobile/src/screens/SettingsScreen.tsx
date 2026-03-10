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

import { 
  Moon, 
  Sun, 
  Smartphone, 
  Globe, 
  BookMarked, 
  Info, 
  User, 
  ChevronRight,
  Check
} from 'lucide-react-native';

const LOCALE_NAMES: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

interface SettingRowProps {
  label: string;
  icon: React.ReactNode;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

function SettingRow({ label, icon, value, onPress, rightElement, showChevron = true }: SettingRowProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
          {icon}
        </View>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
        {rightElement}
        {onPress && showChevron && (
          <ChevronRight size={18} color={colors.textMuted} style={{ marginLeft: 8 }} />
        )}
      </View>
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
      <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
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
        return "Qorong'i";
      case 'light':
        return "Yorug'";
      default:
        return 'Sistema';
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon size={20} color={colors.primary} />;
      case 'light':
        return <Sun size={20} color={colors.primary} />;
      default:
        return <Smartphone size={20} color={colors.primary} />;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Sozlamalar
        </Text>
      </View>

      {/* Appearance */}
      <SettingSection title="TASHQI KO'RINISH">
        <SettingRow
          label="Mavzu"
          icon={getThemeIcon()}
          value={getThemeLabel()}
          onPress={handleThemeToggle}
        />
      </SettingSection>

      {/* Language */}
      <SettingSection title="TIL">
        <SettingRow
          label="Ilova tili"
          icon={<Globe size={20} color={colors.primary} />}
          value={LOCALE_NAMES[locale]}
          onPress={() => setShowLanguages(!showLanguages)}
          showChevron={!showLanguages}
        />
        {showLanguages && (
          <View style={styles.languageOptions}>
            {SUPPORTED_LOCALES.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.languageOption,
                  locale === loc && { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
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
                  <Check size={18} color={colors.primary} />
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
          icon={<BookMarked size={20} color={colors.primary} />}
          value={`${savedArticles.length} ta`}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="ILOVA HAQIDA">
        <SettingRow 
          label="Versiya" 
          icon={<Info size={20} color={colors.primary} />}
          value="1.0.0" 
        />
        <SettingRow 
          label="Ishlab chiqaruvchi" 
          icon={<User size={20} color={colors.primary} />}
          value="News App Team" 
        />
      </SettingSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: 60,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fonts.sizes['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 1,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
  languageOptions: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginLeft: 52, // Align with text, skipping icon
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  languageText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
  },
});
