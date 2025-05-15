import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  TextInput
} from 'react-native';
import styles from '../styles';

export default function RecipesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock recipe data - in a real app, this would come from an API
  const recipes = [
    {
      id: 1,
      title: "Iron-Rich Lentil Soup",
      description: "Boost your iron levels with this hearty lentil soup",
      category: "iron",
      prepTime: "15 min",
      cookTime: "30 min",
      ingredients: [
        "1 cup red lentils",
        "1 onion, chopped",
        "2 carrots, diced",
        "2 celery stalks, diced",
        "3 cloves garlic, minced",
        "4 cups vegetable broth",
        "1 tsp cumin",
        "1 tsp turmeric",
        "Salt and pepper to taste",
        "1 tbsp olive oil",
        "1 handful spinach (for added iron)"
      ],
      instructions: [
        "Heat olive oil in a large pot over medium heat.",
        "Add onions, carrots, and celery. Sauté until softened, about 5 minutes.",
        "Add garlic and spices, cook for 1 minute until fragrant.",
        "Add lentils and vegetable broth. Bring to a boil.",
        "Reduce heat and simmer for 25-30 minutes until lentils are tender.",
        "Add spinach in the last 2 minutes of cooking.",
        "Season with salt and pepper to taste.",
        "Serve warm with a slice of whole grain bread."
      ],
      nutritionalInfo: "Rich in iron, folate, protein, and fiber. Perfect for boosting hemoglobin levels during pregnancy.",
      imageUrl: "https://example.com/lentil-soup.jpg"
    },
    {
      id: 2,
      title: "Calcium-Boosting Smoothie Bowl",
      description: "Delicious smoothie bowl packed with calcium for bone health",
      category: "calcium",
      prepTime: "10 min",
      cookTime: "0 min",
      ingredients: [
        "1 cup Greek yogurt",
        "1/2 cup frozen berries",
        "1 banana",
        "2 tbsp almond butter",
        "1 tbsp chia seeds",
        "1 tbsp honey",
        "1/4 cup granola for topping",
        "Sliced fruits for topping"
      ],
      instructions: [
        "Blend Greek yogurt, frozen berries, banana, almond butter, chia seeds, and honey until smooth.",
        "Pour into a bowl.",
        "Top with granola and sliced fruits.",
        "Enjoy immediately."
      ],
      nutritionalInfo: "High in calcium, protein, and antioxidants. Supports bone development for both mom and baby.",
      imageUrl: "https://example.com/smoothie-bowl.jpg"
    },
    {
      id: 3,
      title: "Folate-Rich Mediterranean Salad",
      description: "Fresh salad loaded with folate-rich ingredients",
      category: "folate",
      prepTime: "15 min",
      cookTime: "0 min",
      ingredients: [
        "4 cups spinach leaves",
        "1 cup chickpeas, rinsed and drained",
        "1 avocado, diced",
        "1/2 cup cherry tomatoes, halved",
        "1/4 cup red onion, thinly sliced",
        "1/4 cup feta cheese, crumbled",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "1 tsp dried oregano",
        "Salt and pepper to taste"
      ],
      instructions: [
        "In a large bowl, combine spinach, chickpeas, avocado, cherry tomatoes, and red onion.",
        "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
        "Pour dressing over salad and toss gently.",
        "Sprinkle with crumbled feta cheese before serving."
      ],
      nutritionalInfo: "Excellent source of folate, which is crucial for preventing neural tube defects. Also provides healthy fats and protein.",
      imageUrl: "https://example.com/mediterranean-salad.jpg"
    },
    {
      id: 4,
      title: "Ginger Lemon Morning Sickness Tea",
      description: "Soothing tea to help with nausea and morning sickness",
      category: "nausea",
      prepTime: "5 min",
      cookTime: "5 min",
      ingredients: [
        "1-inch piece fresh ginger, sliced",
        "1 lemon, sliced",
        "1 tbsp honey",
        "2 cups water",
        "Mint leaves (optional)"
      ],
      instructions: [
        "Bring water to a boil in a small pot.",
        "Add ginger slices and simmer for 5 minutes.",
        "Remove from heat and add lemon slices and honey.",
        "Let steep for 5 minutes.",
        "Strain into a mug and add mint leaves if desired.",
        "Sip slowly when feeling nauseous."
      ],
      nutritionalInfo: "Ginger has natural anti-nausea properties. Lemon adds vitamin C, while honey provides a gentle energy boost.",
      imageUrl: "https://example.com/ginger-tea.jpg"
    },
    {
      id: 5,
      title: "Protein-Packed Quinoa Bowl",
      description: "Nutritious quinoa bowl with plenty of protein for baby's growth",
      category: "protein",
      prepTime: "10 min",
      cookTime: "20 min",
      ingredients: [
        "1 cup quinoa, rinsed",
        "2 cups vegetable broth",
        "1 cup black beans, rinsed and drained",
        "1 cup roasted sweet potato cubes",
        "1 avocado, sliced",
        "2 eggs, soft-boiled",
        "1/4 cup pumpkin seeds",
        "2 tbsp olive oil",
        "1 tbsp lime juice",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cook quinoa in vegetable broth according to package instructions.",
        "While quinoa cooks, soft-boil the eggs (6-7 minutes in boiling water).",
        "In a large bowl, combine cooked quinoa, black beans, and sweet potato.",
        "Drizzle with olive oil and lime juice, season with salt and pepper.",
        "Top with sliced avocado, halved eggs, and pumpkin seeds."
      ],
      nutritionalInfo: "Complete protein source from quinoa, eggs, and beans. Rich in healthy fats and complex carbohydrates for sustained energy.",
      imageUrl: "https://example.com/quinoa-bowl.jpg"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Recipes' },
    { id: 'iron', name: 'Iron-Rich' },
    { id: 'calcium', name: 'Calcium-Rich' },
    { id: 'folate', name: 'Folate-Rich' },
    { id: 'protein', name: 'Protein-Packed' },
    { id: 'nausea', name: 'Nausea Relief' }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const toggleRecipeDetails = (id) => {
    if (expandedRecipe === id) {
      setExpandedRecipe(null);
    } else {
      setExpandedRecipe(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Pregnancy Recipes</Text>
        <Text style={styles.appSubtitle}>Nutritious meals for mom and baby</Text>
      </View>
      
      <View style={localStyles.searchContainer}>
        <TextInput
          style={localStyles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={localStyles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity 
            key={category.id}
            style={[
              localStyles.categoryButton,
              selectedCategory === category.id ? localStyles.selectedCategoryButton : {}
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text 
              style={[
                localStyles.categoryText,
                selectedCategory === category.id ? localStyles.selectedCategoryText : {}
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={localStyles.recipesContainer}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <View key={recipe.id} style={localStyles.recipeCard}>
              <View style={localStyles.recipeImagePlaceholder}>
                <Text style={localStyles.recipeImageText}>📸</Text>
              </View>
              
              <View style={localStyles.recipeInfo}>
                <Text style={localStyles.recipeTitle}>{recipe.title}</Text>
                <Text style={localStyles.recipeDescription}>{recipe.description}</Text>
                
                <View style={localStyles.recipeMetaInfo}>
                  <Text style={localStyles.recipeTime}>Prep: {recipe.prepTime}</Text>
                  <Text style={localStyles.recipeTime}>Cook: {recipe.cookTime}</Text>
                </View>
                
                <TouchableOpacity
                  style={localStyles.detailsButton}
                  onPress={() => toggleRecipeDetails(recipe.id)}
                >
                  <Text style={localStyles.detailsButtonText}>
                    {expandedRecipe === recipe.id ? 'Hide Details' : 'Show Details'}
                  </Text>
                </TouchableOpacity>
                
                {expandedRecipe === recipe.id && (
                  <View style={localStyles.expandedDetails}>
                    <Text style={localStyles.sectionTitle}>Ingredients:</Text>
                    {recipe.ingredients.map((ingredient, idx) => (
                      <Text key={idx} style={localStyles.listItem}>• {ingredient}</Text>
                    ))}
                    
                    <Text style={localStyles.sectionTitle}>Instructions:</Text>
                    {recipe.instructions.map((step, idx) => (
                      <Text key={idx} style={localStyles.listItem}>{idx + 1}. {step}</Text>
                    ))}
                    
                    <Text style={localStyles.sectionTitle}>Nutritional Benefits:</Text>
                    <Text style={localStyles.nutritionalInfo}>{recipe.nutritionalInfo}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={localStyles.noResultsContainer}>
            <Text style={localStyles.noResultsText}>No recipes found. Try a different search.</Text>
          </View>
        )}
        
        <View style={localStyles.disclaimer}>
          <Text style={localStyles.disclaimerText}>
            Always consult with your healthcare provider about your specific nutritional needs during pregnancy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  searchContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  categoriesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  selectedCategoryButton: {
    backgroundColor: '#9D50BB',
  },
  categoryText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  recipesContainer: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  recipeImagePlaceholder: {
    height: 150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImageText: {
    fontSize: 40,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recipeTime: {
    fontSize: 12,
    color: '#888',
    marginRight: 10,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  detailsButton: {
    backgroundColor: '#9D50BB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  expandedDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    color: '#333',
  },
  listItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
    paddingLeft: 5,
  },
  nutritionalInfo: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  disclaimer: {
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});