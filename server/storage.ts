import {
  users,
  type User,
  type InsertUser,
  messages,
  type Message,
  type InsertMessage,
  conversations,
  type Conversation,
  type InsertConversation,
  topics,
  type Topic,
  type InsertTopic,
  resources,
  type Resource,
  type InsertResource
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, title: string): Promise<Conversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;

  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;

  // Resource methods
  getResources(topicId?: number): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private topics: Map<number, Topic>;
  private resources: Map<number, Resource>;

  private currentUserId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentTopicId: number;
  private currentResourceId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.topics = new Map();
    this.resources = new Map();

    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentTopicId = 1;
    this.currentResourceId = 1;

    // Initialize with default topics
    this.initializeDefaultTopics();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter((conversation) => conversation.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, title: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const updatedConversation: Conversation = {
      ...conversation,
      title,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    // First delete all messages in this conversation
    const messagesToDelete = Array.from(this.messages.values())
      .filter(message => message.conversationId === id);
    
    for (const message of messagesToDelete) {
      this.messages.delete(message.id);
    }
    
    return this.conversations.delete(id);
  }

  // Message methods
  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);

    // Update conversation's updatedAt timestamp
    if (insertMessage.conversationId) {
      const conversation = this.conversations.get(insertMessage.conversationId);
      if (conversation) {
        conversation.updatedAt = new Date();
        this.conversations.set(conversation.id, conversation);
      }
    }

    return message;
  }

  // Topic methods
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentTopicId++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  // Resource methods
  async getResources(topicId?: number): Promise<Resource[]> {
    if (topicId) {
      return Array.from(this.resources.values())
        .filter((resource) => resource.topicId === topicId);
    }
    return Array.from(this.resources.values());
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  private initializeDefaultTopics() {
    const defaultTopics: InsertTopic[] = [
      {
        title: "First Trimester",
        description: "Guidance for weeks 1-12 of pregnancy",
        icon: "ri-calendar-line",
      },
      {
        title: "Second Trimester",
        description: "Information for weeks 13-26 of pregnancy",
        icon: "ri-calendar-2-line",
      },
      {
        title: "Third Trimester",
        description: "Advice for weeks 27-40 of pregnancy",
        icon: "ri-calendar-check-line",
      },
      {
        title: "Nutrition",
        description: "Dietary recommendations during pregnancy",
        icon: "ri-heart-pulse-line",
      },
      {
        title: "Exercise",
        description: "Safe physical activities for expectant mothers",
        icon: "ri-walk-line",
      },
      {
        title: "Common Symptoms",
        description: "Understanding normal pregnancy symptoms",
        icon: "ri-psychotherapy-line",
      },
      {
        title: "Preparing for Birth",
        description: "Getting ready for labor and delivery",
        icon: "ri-home-heart-line",
      },
      {
        title: "Mental Health",
        description: "Emotional wellbeing during pregnancy",
        icon: "ri-mental-health-line",
      },
    ];

    defaultTopics.forEach(this.createTopic.bind(this));

    // Add some sample resources
    const defaultResources: InsertResource[] = [
      {
        title: "Prenatal Vitamin Guide",
        description: "Essential nutrients for a healthy pregnancy",
        link: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
        topicId: 4, // Nutrition
      },
      {
        title: "Safe Pregnancy Exercises",
        description: "Recommended activities by trimester",
        link: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
        topicId: 5, // Exercise
      },
      {
        title: "Managing Morning Sickness",
        description: "Tips for dealing with nausea in early pregnancy",
        link: "https://www.acog.org/womens-health/faqs/morning-sickness",
        topicId: 1, // First Trimester
      },
      {
        title: "Birth Plan Template",
        description: "Creating your ideal labor and delivery experience",
        link: "https://www.acog.org/womens-health/faqs/planning-for-labor-and-delivery",
        topicId: 7, // Preparing for Birth
      },
      {
        title: "Recognizing Depression During Pregnancy",
        description: "Signs, symptoms and when to seek help",
        link: "https://www.acog.org/womens-health/faqs/depression-during-pregnancy",
        topicId: 8, // Mental Health
      }
    ];

    defaultResources.forEach(this.createResource.bind(this));
  }
}

import { DatabaseStorage } from "./databaseStorage";

// Use the database storage implementation
export const storage = new DatabaseStorage();

// Initialize default data
(async () => {
  try {
    await (storage as DatabaseStorage).initializeDefaultTopics();
    console.log("Database initialized with default topics and resources");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();
