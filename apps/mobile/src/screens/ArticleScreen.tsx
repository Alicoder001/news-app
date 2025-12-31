/**
 * Article Detail Screen
 *
 * Full article content display
 *
 * @package @news-app/mobile
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useArticle } from '../hooks/useQueries';
import { useAppStore } from '../store/useAppStore';
import { formatDate } from '@news-app/shared';
import type { RootStackParamList } from '../navigation';
import { spacing, borderRadius, fonts } from '../theme';

type ArticleRouteProp = RouteProp<RootStackParamList, 'Article'>;

export default function ArticleScreen() {
  const route = useRoute<ArticleRouteProp>();
  const { slug } = route.params;
  const { colors } = useTheme();
  const { data: article, isLoading, isError } = useArticle(slug);

  const savedArticles = useAppStore((state) => state.savedArticles);
  const saveArticle = useAppStore((state) => state.saveArticle);
  const unsaveArticle = useAppStore((state) => state.unsaveArticle);

  const isSaved = article ? savedArticles.includes(article.id) : false;

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.originalUrl}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSaveToggle = () => {
    if (!article) return;
    if (isSaved) {
      unsaveArticle(article.id);
    } else {
      saveArticle(article.id);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Maqola topilmadi
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
      )}

      <View style={styles.content}>
        {/* Category & Meta */}
        <View style={styles.metaRow}>
          {article.category && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: article.category.color || colors.primaryLight },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {article.category.icon} {article.category.name}
              </Text>
            </View>
          )}
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {formatDate(article.createdAt, 'long', 'uz')}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

        {/* Reading info */}
        <View style={styles.readingInfo}>
          {article.readingTime && (
            <Text style={[styles.readingTime, { color: colors.textSecondary }]}>
              ⏱ {article.readingTime} daqiqa o'qiladi
            </Text>
          )}
          <Text style={[styles.views, { color: colors.textSecondary }]}>
            👁 {article.viewCount} ko'rildi
          </Text>
        </View>

        {/* Action buttons */}
        <View style={[styles.actions, { borderColor: colors.border }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveToggle}>
            <Text style={{ fontSize: 20 }}>{isSaved ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {isSaved ? 'Saqlangan' : 'Saqlash'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={{ fontSize: 20 }}>📤</Text>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Ulashish
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        {article.summary && (
          <Text style={[styles.summary, { color: colors.textSecondary }]}>
            {article.summary}
          </Text>
        )}

        {/* Content */}
        <Text style={[styles.articleContent, { color: colors.text }]}>
          {article.content}
        </Text>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {article.tags.map((tag) => (
              <View
                key={tag.id}
                style={[styles.tag, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  #{tag.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  content: {
    padding: spacing.base,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
  },
  date: {
    fontSize: fonts.sizes.sm,
  },
  title: {
    fontSize: fonts.sizes['3xl'],
    fontWeight: '700',
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  readingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  readingTime: {
    fontSize: fonts.sizes.sm,
  },
  views: {
    fontSize: fonts.sizes.sm,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
  summary: {
    fontSize: fonts.sizes.lg,
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  articleContent: {
    fontSize: fonts.sizes.base,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fonts.sizes.sm,
  },
});
