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
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const now = new Date();
    const [conversation] = await db
      .insert(conversations)
      .values({
        ...insertConversation,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return conversation;
  }

  async updateConversation(id: number, title: string): Promise<Conversation | undefined> {
    const existingConversation = await this.getConversation(id);
    if (!existingConversation) return undefined;

    const [updatedConversation] = await db
      .update(conversations)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();
    
    return updatedConversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    // First delete all messages in this conversation
    await db
      .delete(messages)
      .where(eq(messages.conversationId, id));
    
    // Then delete the conversation
    await db
      .delete(conversations)
      .where(eq(conversations.id, id));
    
    return true; // Assume success if no error was thrown
  }

  // Message methods
  async getMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
      })
      .returning();

    // Update conversation's updatedAt timestamp
    if (insertMessage.conversationId) {
      await db
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, insertMessage.conversationId));
    }

    return message;
  }

  // Topic methods
  async getTopics(): Promise<Topic[]> {
    return await db.select().from(topics);
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic || undefined;
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db.insert(topics).values(insertTopic).returning();
    return topic;
  }

  // Resource methods
  async getResources(topicId?: number): Promise<Resource[]> {
    if (topicId) {
      return await db.select().from(resources).where(eq(resources.topicId, topicId));
    }
    return await db.select().from(resources);
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  // Initialize default data
  async initializeDefaultTopics(): Promise<void> {
    const existingTopics = await this.getTopics();
    if (existingTopics.length > 0) {
      return; // Data already exists, no need to initialize
    }

    // Insert default topics
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

    for (const topic of defaultTopics) {
      await this.createTopic(topic);
    }

    // Get the created topics to get their IDs
    const topics = await this.getTopics();

    // Add default resources using the topic IDs
    const defaultResources: InsertResource[] = [
      {
        title: "Prenatal Vitamin Guide",
        description: "Essential nutrients for a healthy pregnancy",
        link: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
        topicId: topics.find(t => t.title === "Nutrition")?.id || 4,
      },
      {
        title: "Safe Pregnancy Exercises",
        description: "Recommended activities by trimester",
        link: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
        topicId: topics.find(t => t.title === "Exercise")?.id || 5,
      },
      {
        title: "Managing Morning Sickness",
        description: "Tips for dealing with nausea in early pregnancy",
        link: "https://www.acog.org/womens-health/faqs/morning-sickness",
        topicId: topics.find(t => t.title === "First Trimester")?.id || 1,
      },
      {
        title: "Birth Plan Template",
        description: "Creating your ideal labor and delivery experience",
        link: "https://www.acog.org/womens-health/faqs/planning-for-labor-and-delivery",
        topicId: topics.find(t => t.title === "Preparing for Birth")?.id || 7,
      },
      {
        title: "Recognizing Depression During Pregnancy",
        description: "Signs, symptoms and when to seek help",
        link: "https://www.acog.org/womens-health/faqs/depression-during-pregnancy",
        topicId: topics.find(t => t.title === "Mental Health")?.id || 8,
      }
    ];

    for (const resource of defaultResources) {
      await this.createResource(resource);
    }
  }
}