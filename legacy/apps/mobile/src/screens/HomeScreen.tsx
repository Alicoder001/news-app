/**
 * Home Screen
 *
 * Main article list with infinite scroll
 *
 * @package @news-app/mobile
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useArticles } from '../hooks/useQueries';
import { formatDate, truncate } from '@news-app/shared';
import type { ArticleListItem } from '@news-app/api-types';
import type { RootStackParamList } from '../navigation';
import { spacing, borderRadius, fonts } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

import { Calendar, Clock, ChevronRight } from 'lucide-react-native';

// ... (other imports)

function ArticleCard({ article }: { article: ArticleListItem }) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('Article', { slug: article.slug, title: article.title });
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          {article.category && (
            <View style={styles.categoryBadge}>
              <View style={[styles.categoryDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                {article.category.name.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
          {article.title}
        </Text>
        
        {article.summary && (
          <Text style={[styles.cardSummary, { color: colors.textSecondary }]} numberOfLines={2}>
            {truncate(article.summary, 120)}
          </Text>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Calendar size={12} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {formatDate(article.createdAt, 'relative', 'uz')}
              </Text>
            </View>
            
            {article.readingTime && (
              <View style={styles.metaItem}>
                <Clock size={12} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  {article.readingTime} daqiqa
                </Text>
              </View>
            )}
          </View>
          
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles();

  const articles = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

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
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error?.message || "Ma'lumot yuklashda muammo"}
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Yangiliklar</Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Hozircha maqolalar yo'q
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
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  cardContent: {
    padding: spacing.base,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  cardSummary: {
    fontSize: fonts.sizes.sm,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
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
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: fonts.sizes.sm,
    textAlign: 'center',
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
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fonts.sizes.base,
  },
});
