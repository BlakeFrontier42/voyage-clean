import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { demoContacts, messageTemplates } from '../../lib/store';
import GlowCard from '../../components/GlowCard';
import NeonButton from '../../components/NeonButton';
import InputField from '../../components/InputField';
import { Contact } from '../../types';

const FILTER_TAGS = ['All', 'referral', 'mentor', 'recruiter', 'former-colleague', 'coach'];

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // New contact form state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newHowMet, setNewHowMet] = useState('');

  const filteredContacts = useMemo(() => {
    let result = demoContacts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q)
      );
    }
    if (selectedFilter !== 'All') {
      result = result.filter(c => c.tags?.includes(selectedFilter));
    }
    return result;
  }, [searchQuery, selectedFilter]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = [Colors.neonCyan, Colors.neonPurple, Colors.warning, Colors.success, Colors.info];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const daysSinceInteraction = (date?: string) => {
    if (!date) return null;
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>RELATIONSHIP ENGINE</Text>
          <Text style={styles.headerTitle}>Contacts</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setViewMode(viewMode === 'list' ? 'calendar' : 'list');
            }}
            style={styles.headerButton}
          >
            <Ionicons name={viewMode === 'list' ? 'calendar-outline' : 'list-outline'} size={20} color={Colors.neonCyan} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowAddForm(true);
            }}
            style={styles.headerButton}
          >
            <Ionicons name="person-add-outline" size={20} color={Colors.neonCyan} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectionColor={Colors.neonCyan}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTER_TAGS.map(tag => (
          <Pressable
            key={tag}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedFilter(tag);
            }}
            style={[styles.filterChip, selectedFilter === tag && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, selectedFilter === tag && styles.filterTextActive]}>
              {tag === 'All' ? 'All' : `#${tag}`}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {viewMode === 'list' ? (
          // List View
          filteredContacts.map((contact, index) => {
            const days = daysSinceInteraction(contact.last_interaction);
            const needsOutreach = days !== null && days > 14;
            const avatarColor = getAvatarColor(contact.name);

            return (
              <Animated.View key={contact.id} entering={FadeInDown.delay(index * 60).duration(300)}>
                <GlowCard
                  style={styles.contactCard}
                  variant={needsOutreach ? 'accent' : 'subtle'}
                  onPress={() => setSelectedContact(contact)}
                >
                  <View style={styles.contactRow}>
                    <View style={[styles.avatar, { backgroundColor: avatarColor + '20', borderColor: avatarColor + '40' }]}>
                      <Text style={[styles.avatarText, { color: avatarColor }]}>{getInitials(contact.name)}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRole}>
                        {contact.role}{contact.company ? ` at ${contact.company}` : ''}
                      </Text>
                      {contact.tags && (
                        <View style={styles.tagRow}>
                          {contact.tags.slice(0, 3).map(tag => (
                            <View key={tag} style={styles.miniTag}>
                              <Text style={styles.miniTagText}>#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    <View style={styles.contactMeta}>
                      {days !== null && (
                        <Text style={[styles.daysText, needsOutreach && { color: Colors.warning }]}>
                          {days}d ago
                        </Text>
                      )}
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                  </View>
                  {needsOutreach && (
                    <View style={styles.outreachBanner}>
                      <Ionicons name="alert-circle-outline" size={12} color={Colors.warning} />
                      <Text style={styles.outreachText}>Reconnect — it's been {days} days</Text>
                    </View>
                  )}
                </GlowCard>
              </Animated.View>
            );
          })
        ) : (
          // Calendar View (simplified outreach calendar)
          <GlowCard style={styles.calendarCard}>
            <Text style={styles.sectionLabel}>OUTREACH CALENDAR</Text>
            <Text style={styles.sectionTitle}>Upcoming Follow-ups</Text>
            {demoContacts.map((contact, i) => {
              const days = daysSinceInteraction(contact.last_interaction);
              const nextOutreach = days ? Math.max(0, 14 - days) : 0;
              return (
                <View key={contact.id} style={styles.calendarItem}>
                  <View style={styles.calendarDate}>
                    <Text style={styles.calendarDay}>{nextOutreach === 0 ? 'Today' : `+${nextOutreach}d`}</Text>
                  </View>
                  <View style={styles.calendarInfo}>
                    <Text style={styles.calendarName}>{contact.name}</Text>
                    <Text style={styles.calendarCompany}>{contact.company}</Text>
                  </View>
                  <Pressable
                    style={styles.calendarAction}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedContact(contact);
                      setShowTemplates(true);
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color={Colors.neonCyan} />
                  </Pressable>
                </View>
              );
            })}
          </GlowCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Contact Detail Modal */}
      <Modal visible={!!selectedContact && !showTemplates} animationType="slide" presentationStyle="pageSheet">
        {selectedContact && (
          <View style={styles.modalContainer}>
            <LinearGradient colors={[Colors.spaceBlack, Colors.deepSpace]} style={StyleSheet.absoluteFillObject} />
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setSelectedContact(null)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </Pressable>
              <Text style={styles.modalTitle}>Contact Details</Text>
              <Pressable onPress={() => { setShowTemplates(true); }}>
                <Ionicons name="chatbubble-outline" size={22} color={Colors.neonCyan} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalAvatarSection}>
                <View style={[styles.modalAvatar, { backgroundColor: getAvatarColor(selectedContact.name) + '20' }]}>
                  <Text style={[styles.modalAvatarText, { color: getAvatarColor(selectedContact.name) }]}>
                    {getInitials(selectedContact.name)}
                  </Text>
                </View>
                <Text style={styles.modalName}>{selectedContact.name}</Text>
                <Text style={styles.modalRole}>
                  {selectedContact.role}{selectedContact.company ? ` at ${selectedContact.company}` : ''}
                </Text>
              </View>

              {/* Detail Fields */}
              {[
                { icon: 'mail-outline', label: 'Email', value: selectedContact.email },
                { icon: 'call-outline', label: 'Phone', value: selectedContact.phone },
                { icon: 'gift-outline', label: 'Birthday', value: selectedContact.birthday },
                { icon: 'heart-outline', label: 'Hobbies', value: selectedContact.hobbies?.join(', ') },
                { icon: 'people-outline', label: 'How We Met', value: selectedContact.how_we_met },
                { icon: 'time-outline', label: 'Last Interaction', value: selectedContact.last_interaction },
              ].filter(f => f.value).map((field, i) => (
                <View key={i} style={styles.detailField}>
                  <Ionicons name={field.icon as any} size={16} color={Colors.neonCyan} />
                  <View style={styles.detailFieldContent}>
                    <Text style={styles.detailFieldLabel}>{field.label}</Text>
                    <Text style={styles.detailFieldValue}>{field.value}</Text>
                  </View>
                </View>
              ))}

              {selectedContact.notes && (
                <GlowCard style={{ marginTop: Spacing.lg }}>
                  <Text style={styles.sectionLabel}>NOTES</Text>
                  <Text style={styles.notesText}>{selectedContact.notes}</Text>
                </GlowCard>
              )}

              {selectedContact.tags && (
                <View style={[styles.tagRow, { marginTop: Spacing.lg }]}>
                  {selectedContact.tags.map(tag => (
                    <View key={tag} style={styles.detailTag}>
                      <Text style={styles.detailTagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Message Templates Modal */}
      <Modal visible={showTemplates} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <LinearGradient colors={[Colors.spaceBlack, Colors.deepSpace]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowTemplates(false)}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
            <Text style={styles.modalTitle}>Message Templates</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.templateSubtitle}>
              AI-powered templates for {selectedContact?.name || 'your contact'}
            </Text>
            {messageTemplates.map(template => (
              <GlowCard
                key={template.id}
                style={styles.templateCard}
                variant="subtle"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  const filled = template.template
                    .replace('{{name}}', selectedContact?.name || 'there')
                    .replace('{{company}}', selectedContact?.company || 'your company');
                  Alert.alert(template.label, filled, [
                    { text: 'Copy', onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
              >
                <View style={styles.templateHeader}>
                  <View style={styles.templateIconWrap}>
                    <Ionicons
                      name={
                        template.type === 'birthday' ? 'gift-outline' :
                        template.type === 'congrats' ? 'trophy-outline' :
                        template.type === 'check_in' ? 'chatbubble-outline' :
                        template.type === 'thank_you' ? 'heart-outline' :
                        'refresh-outline'
                      }
                      size={18}
                      color={Colors.neonCyan}
                    />
                  </View>
                  <Text style={styles.templateName}>{template.label}</Text>
                  <Ionicons name="copy-outline" size={16} color={Colors.textMuted} />
                </View>
                <Text style={styles.templatePreview} numberOfLines={2}>{template.template}</Text>
              </GlowCard>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal visible={showAddForm} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <LinearGradient colors={[Colors.spaceBlack, Colors.deepSpace]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowAddForm(false)}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
            <Text style={styles.modalTitle}>New Contact</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <InputField label="Name" placeholder="Contact name" value={newName} onChangeText={setNewName} icon="person-outline" />
            <InputField label="Company" placeholder="Organization" value={newCompany} onChangeText={setNewCompany} icon="business-outline" />
            <InputField label="Role" placeholder="Position" value={newRole} onChangeText={setNewRole} icon="briefcase-outline" />
            <InputField label="Email" placeholder="email@example.com" value={newEmail} onChangeText={setNewEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
            <InputField label="How We Met" placeholder="Conference, LinkedIn, referral..." value={newHowMet} onChangeText={setNewHowMet} icon="people-outline" />
            <NeonButton
              title="ADD TO NETWORK"
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowAddForm(false);
                setNewName(''); setNewCompany(''); setNewRole(''); setNewEmail(''); setNewHowMet('');
              }}
              size="lg"
              icon={<Ionicons name="person-add" size={18} color={Colors.spaceBlack} />}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.spaceBlack,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.panelBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    paddingVertical: Spacing.md,
  },
  filterRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  filterChipActive: {
    backgroundColor: Colors.neonCyanGlow,
    borderColor: Colors.neonCyan,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.neonCyan,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  contactCard: {
    marginBottom: Spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactRole: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  miniTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.neonPurpleGlow,
  },
  miniTagText: {
    fontSize: FontSize.xs,
    color: Colors.neonPurple,
  },
  contactMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  daysText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  outreachBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.warning,
  },
  outreachText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontWeight: '600',
  },
  calendarCard: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
    gap: Spacing.md,
  },
  calendarDate: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  calendarDay: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  calendarInfo: {
    flex: 1,
  },
  calendarName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  calendarCompany: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  calendarAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.spaceBlack,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalContent: {
    padding: Spacing.xl,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalAvatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
  },
  modalName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalRole: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: 2,
  },
  detailField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  detailFieldContent: {
    flex: 1,
  },
  detailFieldLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailFieldValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  notesText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  detailTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neonPurpleGlow,
    borderWidth: 1,
    borderColor: Colors.borderPurple,
  },
  detailTagText: {
    fontSize: FontSize.sm,
    color: Colors.neonPurple,
    fontWeight: '500',
  },
  templateSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  templateCard: {
    marginBottom: Spacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  templateIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  templatePreview: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
