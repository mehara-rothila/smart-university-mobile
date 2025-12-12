import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBook } from '../../api/books';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const CreateBookScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    category: 'TEXTBOOK',
    condition: 'GOOD',
    bookType: 'DONATE',
    price: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const bookTypes = [
    { label: 'For Sale', value: 'SELL', icon: '💰' },
    { label: 'Donate', value: 'DONATE', icon: '🎁' },
    { label: 'Exchange', value: 'EXCHANGE', icon: '🔄' },
  ];

  const categories = [
    { label: 'Textbook', value: 'TEXTBOOK' },
    { label: 'Fiction', value: 'FICTION' },
    { label: 'Non-Fiction', value: 'NON_FICTION' },
    { label: 'Reference', value: 'REFERENCE' },
    { label: 'Other', value: 'OTHER' },
  ];

  const conditions = [
    { label: 'Like New', value: 'LIKE_NEW' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
    { label: 'Poor', value: 'POOR' },
  ];

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', 'Book added successfully', [
          {
            text: 'OK',
            onPress: () => {
              queryClient.invalidateQueries(['books']);
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to add book. Please try again.');
    },
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/epub+zip'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
          return;
        }
        setSelectedFile(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.bookType === 'SELL') {
      if (!formData.price.trim()) {
        newErrors.price = 'Price is required for books for sale';
      } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
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
    data.append('author', formData.author.trim());
    data.append('description', formData.description.trim());
    data.append('isbn', formData.isbn.trim());
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    data.append('bookType', formData.bookType);

    if (formData.bookType === 'SELL' && formData.price) {
      data.append('price', parseFloat(formData.price).toFixed(2));
    }

    if (selectedFile) {
      data.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/pdf',
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

  const getTypeColor = (type) => {
    const typeColors = {
      SELL: colors.accent,
      DONATE: colors.success,
      EXCHANGE: colors.info,
    };
    return typeColors[type] || colors.gray500;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Book Type Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Book Type *</Text>
          <View style={styles.typeContainer}>
            {bookTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  formData.bookType === type.value && styles.typeButtonActive,
                  { backgroundColor: getTypeColor(type.value) },
                  formData.bookType !== type.value && styles.typeButtonInactive,
                ]}
                onPress={() => updateFormData('bookType', type.value)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.bookType !== type.value && styles.typeButtonTextInactive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* File Picker */}
        <Card style={styles.card}>
          <Text style={styles.label}>Book File (Optional)</Text>
          <TouchableOpacity style={styles.filePickerButton} onPress={pickDocument}>
            {selectedFile ? (
              <View style={styles.fileSelected}>
                <Text style={styles.fileIcon}>📄</Text>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Text style={styles.removeFileIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.filePlaceholder}>
                <Text style={styles.filePlaceholderIcon}>📎</Text>
                <Text style={styles.filePlaceholderText}>Add PDF or EPUB</Text>
                <Text style={styles.filePlaceholderSubtext}>(Max 10MB)</Text>
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
            placeholder="e.g., Introduction to Computer Science"
            error={errors.title}
            required
          />

          <Input
            label="Author"
            value={formData.author}
            onChangeText={(value) => updateFormData('author', value)}
            placeholder="e.g., John Smith"
            error={errors.author}
            required
          />

          <Input
            label="ISBN (Optional)"
            value={formData.isbn}
            onChangeText={(value) => updateFormData('isbn', value)}
            placeholder="e.g., 978-3-16-148410-0"
          />

          {formData.bookType === 'SELL' && (
            <Input
              label="Price"
              value={formData.price}
              onChangeText={(value) => updateFormData('price', value)}
              placeholder="e.g., 29.99"
              keyboardType="decimal-pad"
              error={errors.price}
              required
            />
          )}

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Describe the book..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        {/* Category Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.optionsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.optionButton,
                  formData.category === category.value && styles.optionButtonActive,
                ]}
                onPress={() => updateFormData('category', category.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.category === category.value && styles.optionTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Condition Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.optionsContainer}>
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.value}
                style={[
                  styles.optionButton,
                  formData.condition === condition.value && styles.optionButtonActive,
                ]}
                onPress={() => updateFormData('condition', condition.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.condition === condition.value && styles.optionTextActive,
                  ]}
                >
                  {condition.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Add Book"
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
    gap: 8,
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
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  typeButtonTextInactive: {
    color: colors.textSecondary,
  },
  filePickerButton: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  fileSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.gray100,
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  removeFileIcon: {
    fontSize: 24,
    color: colors.error,
    paddingHorizontal: 8,
  },
  filePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.gray100,
  },
  filePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  filePlaceholderText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  filePlaceholderSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.white,
  },
  submitContainer: {
    marginTop: 8,
  },
});

export default CreateBookScreen;
