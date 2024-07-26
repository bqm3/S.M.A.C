import SkeletonContent from 'react-native-skeleton-content';

export default function Skeleton () {
    return (
      <SkeletonContent borderRadius={4}
          containerStyle={{flex: 1, width: 300}}
          boneColor="#121212"
          highlightColor="#333333"
          animationType="pulse"
          layout={[
            // long line
            { width: 220, height: 20, marginBottom: 6 },
            // short line
            { width: 180, height: 20, marginBottom: 6 },
          ]}
          isLoading={true}>
      
      </SkeletonContent>
    )
  }