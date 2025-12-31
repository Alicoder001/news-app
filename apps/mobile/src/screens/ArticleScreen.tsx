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

import { 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Heart, 
  ChevronLeft,
  ChevronRight,
  Hash
} from 'lucide-react-native';

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
      showsVerticalScrollIndicator={false}
    >
      {article.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
          <View style={styles.imageOverlay} />
        </View>
      )}

      <View style={styles.content}>
        {/* Category & Meta */}
        <View style={styles.metaRow}>
          {article.category && (
            <View style={styles.categoryBadge}>
              <View style={[styles.categoryDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                {article.category.name.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.dateContainer}>
            <Calendar size={12} color={colors.textMuted} />
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDate(article.createdAt, 'long', 'uz')}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

        {/* Reading info */}
        <View style={styles.readingInfo}>
          {article.readingTime && (
            <View style={styles.infoItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {article.readingTime} daqiqa
              </Text>
            </View>
          )}
          <View style={styles.infoItem}>
            <Eye size={14} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {article.viewCount} ko'rildi
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={[styles.actions, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isSaved ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }]} 
            onPress={handleSaveToggle}
            activeOpacity={0.7}
          >
            <Heart size={20} color={isSaved ? '#EF4444' : colors.textSecondary} fill={isSaved ? '#EF4444' : 'transparent'} />
            <Text style={[styles.actionText, { color: isSaved ? '#EF4444' : colors.textSecondary }]}>
              {isSaved ? 'Saqlangan' : 'Saqlash'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.7}>
            <Share2 size={20} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Ulashish
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        {article.summary && (
          <View style={[styles.summaryContainer, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
            <Text style={[styles.summary, { color: colors.textSecondary }]}>
              {article.summary}
            </Text>
          </View>
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
                style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Hash size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {tag.name}
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
    paddingBottom: spacing['4xl'],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  content: {
    padding: spacing.base,
    marginTop: -20,
    backgroundColor: 'transparent',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
    backgroundColor: 'transparent',
    paddingTop: 10,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: fonts.sizes['3xl'],
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: spacing.base,
    letterSpacing: -0.5,
  },
  readingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    marginBottom: spacing.xl,
  },
  summary: {
    fontSize: fonts.sizes.lg,
    fontWeight: '500',
    lineHeight: 28,
  },
  articleContent: {
    fontSize: 17,
    lineHeight: 30,
    marginBottom: spacing['2xl'],
    fontWeight: '400',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
