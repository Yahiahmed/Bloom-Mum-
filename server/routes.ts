import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as deepseekAPI from "./deepseek";
import * as localFallback from "./localFallback";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";

// Use local fallback for faster responses
const { getAIResponse, generateTitle } = localFallback;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  // Get all topics
  app.get("/api/topics", async (_req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve topics" });
    }
  });

  // Get a specific topic
  app.get("/api/topics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getTopic(id);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve topic" });
    }
  });

  // Get resources (optionally filtered by topic)
  app.get("/api/resources", async (req, res) => {
    try {
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const resources = await storage.getResources(topicId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve resources" });
    }
  });

  // Get conversations for a user
  app.get("/api/conversations", async (req, res) => {
    try {
      // In a real app, we would get userId from auth
      // For this demo, we'll use a default user id of 1
      const userId = 1;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve conversations" });
    }
  });

  // Get a specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve conversation" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      // Default user ID for demo
      const userId = 1;
      
      // Validate request body
      const { title } = req.body;
      const validatedData = insertConversationSchema.parse({ 
        userId, 
        title: title || "New Conversation" 
      });
      
      const conversation = await storage.createConversation(validatedData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Update conversation title
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      
      const updatedConversation = await storage.updateConversation(id, title);
      
      if (!updatedConversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(updatedConversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });

  // Delete a conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteConversation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/chat", async (req, res) => {
    try {
      // Default user ID for demo
      const userId = 1;
      
      // Validate request body
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      let currentConversationId = conversationId;
      
      // If no conversation ID provided, create a new conversation
      if (!currentConversationId) {
        // Generate a title for the new conversation
        const title = await generateTitle(message);
        
        const newConversation = await storage.createConversation({
          userId,
          title
        });
        
        currentConversationId = newConversation.id;
      }
      
      // Save user message
      const userMessage = await storage.createMessage({
        userId,
        content: message,
        role: 'user',
        conversationId: currentConversationId
      });
      
      // Get all messages in the conversation for context
      const conversationMessages = await storage.getMessages(currentConversationId);
      
      // Format messages for OpenAI API
      const formattedMessages = conversationMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Get AI response
      const aiResponseContent = await getAIResponse(formattedMessages);
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        userId,
        content: aiResponseContent,
        role: 'assistant',
        conversationId: currentConversationId
      });
      
      // Return both messages and conversation ID
      res.status(201).json({
        conversationId: currentConversationId,
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  return httpServer;
}
