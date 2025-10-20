'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DishReviewDialog from './DishReviewDialog';
import { addDishToFavorite, removeDishFromFavorite, isDishInFavorites } from '../actions/dishFavoriteActions';
import { hasDishBeenReviewed } from '../actions/dishReviewActions';

interface DishActionButtonsProps {
  dishId: string;
  dishName: string;
}

export default function DishActionButtons({ dishId, dishName }: DishActionButtonsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingRating, setExistingRating] = useState<number | undefined>();
  const [existingComment, setExistingComment] = useState<string | undefined>();
  const [isCheckingReview, setIsCheckingReview] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      setIsCheckingFavorite(true);
      const inFavorites = await isDishInFavorites(dishId);
      setIsFavorite(inFavorites);
      setIsCheckingFavorite(false);
    };
    checkFavorite();
  }, [dishId]);

  // Check review status
  useEffect(() => {
    const checkReview = async () => {
      setIsCheckingReview(true);
      const reviewData = await hasDishBeenReviewed(dishId);
      setHasReviewed(reviewData.reviewed);
      if (reviewData.reviewed) {
        setExistingRating(reviewData.rating);
        setExistingComment(reviewData.comment);
      }
      setIsCheckingReview(false);
    };
    checkReview();
  }, [dishId]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      // Show confirmation dialog before removing
      setShowRemoveDialog(true);
    } else {
      // Show confirmation dialog before adding
      setShowAddDialog(true);
    }
  };

  const handleConfirmAddFavorite = async () => {
    setIsTogglingFavorite(true);
    const result = await addDishToFavorite(dishId);
    setIsTogglingFavorite(false);
    setShowAddDialog(false);

    if (result.success) {
      setIsFavorite(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleConfirmRemoveFavorite = async () => {
    setIsTogglingFavorite(true);
    const result = await removeDishFromFavorite(dishId);
    setIsTogglingFavorite(false);
    setShowRemoveDialog(false);

    if (result.success) {
      setIsFavorite(false);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleReviewClick = () => {
    setShowReviewDialog(true);
  };

  const handleReviewDialogClose = async (open: boolean) => {
    setShowReviewDialog(open);

    // Refresh review status after dialog closes
    if (!open) {
      const reviewData = await hasDishBeenReviewed(dishId);
      setHasReviewed(reviewData.reviewed);
      if (reviewData.reviewed) {
        setExistingRating(reviewData.rating);
        setExistingComment(reviewData.comment);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavoriteClick}
        disabled={isCheckingFavorite || isTogglingFavorite}
        className="gap-2"
      >
        {isTogglingFavorite ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
          />
        )}
        <span className="text-xs">{isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}</span>
      </Button>

      {/* Review Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReviewClick}
        disabled={isCheckingReview}
        className="gap-2"
      >
        <div className="flex items-center gap-1">
          {hasReviewed && existingRating ? (
            // Show actual stars based on rating
            Array.from({ length: existingRating }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))
          ) : (
            <Star className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <span className="text-xs">{hasReviewed ? 'تعديل التقييم' : 'تقييم'}</span>
      </Button>

      {/* Add to Favorites Confirmation Dialog */}
      <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إضافة إلى المفضلة</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد إضافة <strong>{dishName}</strong> إلى قائمة المفضلة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingFavorite}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAddFavorite}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? 'جاري الإضافة...' : 'إضافة'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove from Favorites Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إزالة من المفضلة</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد إزالة <strong>{dishName}</strong> من قائمة المفضلة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingFavorite}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemoveFavorite}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? 'جاري الإزالة...' : 'إزالة'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Dialog */}
      <DishReviewDialog
        open={showReviewDialog}
        onOpenChange={handleReviewDialogClose}
        dishId={dishId}
        dishName={dishName}
        existingRating={existingRating}
        existingComment={existingComment}
      />
    </div>
  );
}

