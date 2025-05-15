import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF9FB2', // Pink
  secondary: '#A5DEE5', // Teal
  accent: '#B57EDC', // Purple for the heart icon
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textLighter: '#888888',
  border: '#F0F0F0',
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8'
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    paddingTop: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.background,
    opacity: 0.8,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.border,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topicCard: {
    width: '48%',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  topicIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
  },
  chatContainer: {
    flex: 1,
    paddingTop: 20,
  },
  messagesList: {
    padding: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  assistantBubble: {
    backgroundColor: colors.border,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  userMessageText: {
    color: colors.background,
  },
  timestampText: {
    fontSize: 12,
    color: colors.textLighter,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textLighter,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 46,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: colors.text,
  },
  topicsList: {
    padding: 10,
  },
  topicListItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  topicListIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  topicListContent: {
    flex: 1,
  },
  topicListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  topicListDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  resourcesList: {
    padding: 15,
  },
  resourceCard: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.text,
  },
  resourceDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 10,
  },
  resourceButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  resourceButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  savedResponsesList: {
    padding: 15,
  },
  savedResponseCard: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  savedResponseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  savedResponseText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  savedResponseDate: {
    fontSize: 12,
    color: colors.textLighter,
    alignSelf: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.text,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});