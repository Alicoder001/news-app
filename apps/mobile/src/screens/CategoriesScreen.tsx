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
    navigation.navigate('Home', {
      categorySlug: category.slug,
      categoryName: category.name,
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.categoryIndicator, { backgroundColor: colors.primary }]} />
      <View style={styles.categoryInfo}>
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
      </View>
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
          Kategoriyalar
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 60,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fonts.sizes['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  listContent: {
    padding: spacing.base,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: spacing.base,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: fonts.sizes.sm,
    lineHeight: 18,
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
