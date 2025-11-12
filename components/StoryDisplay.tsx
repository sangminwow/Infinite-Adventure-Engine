import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface StoryDisplayProps {
  story: string;
  imageUrl: string | null;
  isImageLoading: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, imageUrl, isImageLoading }) => {
  return (
    <div className="w-full lg:w-3/4 bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700">
      <div className="aspect-w-16 aspect-h-9 bg-gray-900 flex items-center justify-center">
        {isImageLoading ? (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-2 text-gray-400">환상을 불러오는 중...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Current scene" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">운명의 안개가 아직 걷히지 않았습니다...</p>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        <p className="text-gray-300 leading-relaxed text-lg">{story || '새로운 챕터가 당신의 결정을 기다립니다.'}</p>
      </div>
    </div>
  );
};

export default StoryDisplay;