import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLostFoundItem } from '../../api/lostFound';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const CreateLostFoundScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    type: 'LOST',
    location: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    { label: 'Electronics', value: 'ELECTRONICS', icon: '📱' },
    { label: 'Books', value: 'BOOKS', icon: '📚' },
    { label: 'Clothing', value: 'CLOTHING', icon: '👕' },
    { label: 'Accessories', value: 'ACCESSORIES', icon: '👜' },
    { label: 'Documents', value: 'DOCUMENTS', icon: '📄' },
    { label: 'Other', value: 'OTHER', icon: '📦' },
  ];

  const types = [
    { label: 'Lost', value: 'LOST' },
    { label: 'Found', value: 'FOUND' },
  ];

  const createMutation = useMutation({
    mutationFn: createLostFoundItem,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', 'Item posted successfully', [
          {
            text: 'OK',
            onPress: () => {
              queryClient.invalidateQueries(['lostFoundItems']);
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to post item. Please try again.');
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleImagePress = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('category', formData.category);
    data.append('type', formData.type);
    data.append('location', formData.location.trim());

    if (selectedImage) {
      const imageUri = selectedImage.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      data.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }

    createMutation.mutate(data);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Type Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Item Type *</Text>
          <View style={styles.typeContainer}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  formData.type === type.value && styles.typeButtonActive,
                  { backgroundColor: type.value === 'LOST' ? colors.error : colors.success },
                  formData.type !== type.value && styles.typeButtonInactive,
                ]}
                onPress={() => updateFormData('type', type.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type !== type.value && styles.typeButtonTextInactive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Image Picker */}
        <Card style={styles.card}>
          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePress}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* Form Fields */}
        <Card style={styles.card}>
          <Input
            label="Title"
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="e.g., Black backpack"
            error={errors.title}
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Describe the item in detail..."
            multiline
            numberOfLines={4}
            error={errors.description}
            required
            style={styles.textArea}
          />

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
            placeholder="e.g., Library, Building A"
            error={errors.location}
            required
          />
        </Card>

        {/* Category Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  formData.category === category.value && styles.categoryButtonActive,
                ]}
                onPress={() => updateFormData('category', category.value)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    formData.category === category.value && styles.categoryLabelActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Post Item"
            onPress={handleSubmit}
            loading={createMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    opacity: 1,
  },
  typeButtonInactive: {
    backgroundColor: colors.gray200,
    opacity: 0.5,
  },
  typeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  typeButtonTextInactive: {
    color: colors.textSecondary,
  },
  imagePickerButton: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    width: '31%',
    aspectRatio: 1.2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  categoryButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  submitContainer: {
    marginTop: 8,
  },
});

export default CreateLostFoundScreen;
