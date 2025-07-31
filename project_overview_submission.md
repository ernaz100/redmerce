# **LLM & Beyond 2025 – Project Overview**

## **Project: Redmerce** (reden + commerce)

**By:** *Eric Nazarenus*

### **Project Concept**

Redmerce is an AI-powered shopping assistant designed to streamline the online shopping experience. Users simply describe what they’re looking to buy, and the LLM asks clarifying questions to better understand their needs.

Once preferences are clarified, the agent performs real-time web research using the **Perplexity API**, retrieving relevant and concrete product suggestions. These product names are then passed to the **SerpAPI (Google Shopping API)** to fetch the most current details—such as pricing, product links, and availability.

### **User Flow**

1. **Input** – User describes the desired product.
2. **Clarification** – LLM asks follow-up questions to narrow down preferences.
3. **Research** – The agent uses Perplexity to find suitable products.
4. **Product Data** – Product names are used with SerpAPI to gather pricing and direct shopping links.
5. **Outcome** – The user is presented with ready-to-buy options or can choose to explore further.

### **Results & Reflection**

The core objectives of the project were successfully met:
- Users can describe their needs, receive tailored suggestions, and access real-time product data with actionable links.

However, in practical use, the system’s performance has some limitations:

* **Speed:** The reasoning process is way too slow.
* **Consistency:** The quality and detail of responses vary depending on the inputs and external API responses.

### **Demo & Source Code**

*  **[Watch the Demo Video](./redmerce_DEMO.mov)**
*  **[Explore the Code Repository for more details](https://github.com/ernaz100/redmerce)**

To run the app yourself, you’ll need API keys for:

* **Perplexity**
* **OpenAI**
* **SerpAPI** *(free tier: 100 monthly Google Shopping requests)*

### **Closing Note**

Thank you for the seminar—participating in it was a genuinely enjoyable and insightful experience!
