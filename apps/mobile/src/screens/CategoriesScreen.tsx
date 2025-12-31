/**
 * Categories Screen
 *
 * Grid of article categories
 *
 * @package @news-app/mobile
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeProvider';
import { useCategories } from '../hooks/useQueries';
import type { Category } from '@news-app/api-types';
import type { MainTabParamList } from '../navigation';
import { spacing, borderRadius, fonts } from '../theme';

type NavigationProp = BottomTabNavigationProp<MainTabParamList>;

function CategoryCard({ category }: { category: Category }) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    // Navigate to Home with category filter
    // For now, just show the category
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: category.color || colors.primaryLight,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
      <Text style={[styles.categoryName, { color: colors.text }]}>
        {category.name}
      </Text>
      {category.description && (
        <Text
          style={[styles.categoryDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {category.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { data: categories, isLoading, isError, refetch } = useCategories();

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Yuklanmoqda...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Xatolik yuz berdi
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Qayta urinish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          📂 Kategoriyalar
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Kategoriyalar topilmadi
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContent: {
    padding: spacing.base,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: 120,
    maxWidth: '48%',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fonts.sizes.base,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: fonts.sizes.xs,
    lineHeight: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.base,
    fontSize: fonts.sizes.base,
  },
  errorText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fonts.sizes.base,
  },
});
