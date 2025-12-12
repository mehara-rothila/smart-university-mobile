import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation } from '@tanstack/react-query';
import { sendChatMessage, sendChatMessageWithDocument, clearChatHistory } from '../../api/chatbot';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your Smart University assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const flatListRef = useRef(null);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, hasDocument }) => {
      if (hasDocument && uploadedDocument) {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('document', {
          uri: uploadedDocument.uri,
          name: uploadedDocument.name,
          type: uploadedDocument.mimeType || 'application/pdf',
        });
        return sendChatMessageWithDocument(formData);
      } else {
        // Send conversation history (last 10 messages)
        const history = messages
          .slice(-10)
          .map((msg) => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.text,
          }));
        return sendChatMessage(message, history);
      }
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response || response.data.message || 'I received your message.',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);

        // Clear uploaded document after successful send
        if (uploadedDocument) {
          setUploadedDocument(null);
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to get response from chatbot');
        // Remove the user message if bot failed to respond
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  const handleSend = () => {
    const trimmedText = inputText.trim();
    if (!trimmedText && !uploadedDocument) return;

    // Add user message to the conversation
    const userMessage = {
      id: Date.now(),
      text: trimmedText || '📎 Document attached',
      isBot: false,
      timestamp: new Date(),
      hasDocument: !!uploadedDocument,
      documentName: uploadedDocument?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Send to API
    sendMessageMutation.mutate({
      message: trimmedText || 'Please analyze this document.',
      hasDocument: !!uploadedDocument,
    });
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 5MB');
          return;
        }
        setUploadedDocument(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear the conversation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory();
            setMessages([
              {
                id: 1,
                text: 'Conversation cleared. How can I help you?',
                isBot: true,
                timestamp: new Date(),
              },
            ]);
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isBot ? styles.botMessageContainer : styles.userMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.messageText, item.isBot ? styles.botText : styles.userText]}>
          {item.text}
        </Text>
        {item.hasDocument && item.documentName && (
          <View style={styles.documentBadge}>
            <Text style={styles.documentBadgeText}>📎 {item.documentName}</Text>
          </View>
        )}
        <Text style={[styles.timestamp, item.isBot ? styles.botTimestamp : styles.userTimestamp]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Loading Indicator */}
        {sendMessageMutation.isPending && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <Text style={styles.loadingText}>Thinking...</Text>
              <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </View>
        )}

        {/* Document Upload Preview */}
        {uploadedDocument && (
          <View style={styles.documentPreview}>
            <Text style={styles.documentPreviewIcon}>📎</Text>
            <Text style={styles.documentPreviewText} numberOfLines={1}>
              {uploadedDocument.name}
            </Text>
            <TouchableOpacity onPress={() => setUploadedDocument(null)}>
              <Text style={styles.removeDocumentIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handlePickDocument}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() && !uploadedDocument) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={(!inputText.trim() && !uploadedDocument) || sendMessageMutation.isPending}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  botBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    lineHeight: 20,
  },
  botText: {
    color: colors.text,
  },
  userText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
  botTimestamp: {
    color: colors.textLight,
  },
  userTimestamp: {
    color: colors.white,
    opacity: 0.8,
  },
  documentBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  documentBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  loadingBubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    maxWidth: '60%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  documentPreviewIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  documentPreviewText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  removeDocumentIcon: {
    fontSize: 20,
    color: colors.error,
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  attachIcon: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.white,
  },
});

export default ChatbotScreen;
