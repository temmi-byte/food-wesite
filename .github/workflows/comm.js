 // Sidebar functionality
        const openSidebarBtn = document.getElementById('open-sidebar-btn');
        const closeSidebarBtn = document.getElementById('close-sidebar-btn');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        function openSidebar() {
            mobileSidebar.classList.remove('-translate-x-full');
            mobileSidebar.classList.add('translate-x-0');
            sidebarOverlay.classList.remove('hidden');
            setTimeout(() => {
                sidebarOverlay.classList.add('opacity-100');
            }, 10);
        }

        function closeSidebar() {
            mobileSidebar.classList.remove('translate-x-0');
            mobileSidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.remove('opacity-100');
            setTimeout(() => {
                sidebarOverlay.classList.add('hidden');
            }, 300);
        }

        openSidebarBtn.addEventListener('click', openSidebar);
        closeSidebarBtn.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        // --- Recipe Generator Modal functionality ---
        const openRecipeModalBtn = document.getElementById('open-recipe-modal-btn');
        const closeRecipeModalBtn = document.getElementById('close-recipe-modal-btn');
        const recipeModal = document.getElementById('recipe-modal');
        const ingredientsInput = document.getElementById('ingredients-input');
        const generateRecipeBtn = document.getElementById('generate-recipe-btn');
        const recipeOutput = document.getElementById('recipe-output');
        const recipePlaceholder = document.getElementById('recipe-placeholder');
        const recipeLoading = document.getElementById('recipe-loading');
        const recipeContent = document.getElementById('recipe-content');
        const recipeError = document.getElementById('recipe-error');

        function openRecipeModal() {
            recipeModal.classList.add('open');
            ingredientsInput.value = '';
            recipeContent.innerHTML = '';
            recipePlaceholder.classList.remove('hidden');
            recipeLoading.classList.add('hidden');
            recipeContent.classList.add('hidden');
            recipeError.classList.add('hidden');
        }

        function closeRecipeModal() {
            recipeModal.classList.remove('open');
        }

        openRecipeModalBtn.addEventListener('click', openRecipeModal);
        closeRecipeModalBtn.addEventListener('click', closeRecipeModal);
        recipeModal.addEventListener('click', (e) => {
            if (e.target === recipeModal) {
                closeRecipeModal();
            }
        });

        async function generateRecipe() {
            const ingredients = ingredientsInput.value.trim();
            if (!ingredients) {
                recipeError.textContent = 'Please enter some ingredients.';
                recipeError.classList.remove('hidden');
                return;
            }

            recipePlaceholder.classList.add('hidden');
            recipeContent.classList.add('hidden');
            recipeError.classList.add('hidden');
            recipeLoading.classList.remove('hidden');
            generateRecipeBtn.disabled = true;

            const prompt = `Generate a creative and detailed recipe using the following ingredients: ${ingredients}. Please include:
            1. Recipe Name
            2. Ingredients list (with quantities, if possible)
            3. Instructions (numbered steps)
            4. Estimated preparation and cooking time
            5. Serving suggestions (optional)
            Format the response clearly and concisely, like a recipe card.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    recipeContent.innerHTML = formatTextToHtml(text); // Use generic formatter
                    recipeContent.classList.remove('hidden');
                } else {
                    recipeError.textContent = 'Failed to generate recipe. Please try again.';
                    recipeError.classList.remove('hidden');
                    console.error('Gemini API response structure unexpected:', result);
                }
            } catch (error) {
                recipeError.textContent = 'An error occurred while generating the recipe. Please check your network or try again later.';
                recipeError.classList.remove('hidden');
                console.error('Error calling Gemini API:', error);
            } finally {
                recipeLoading.classList.add('hidden');
                generateRecipeBtn.disabled = false;
            }
        }
        generateRecipeBtn.addEventListener('click', generateRecipe);

        // --- Meal Plan Generator Modal functionality ---
        const openMealPlanModalBtn = document.getElementById('open-meal-plan-modal-btn');
        const closeMealPlanModalBtn = document.getElementById('close-meal-plan-modal-btn');
        const mealPlanModal = document.getElementById('meal-plan-modal');
        const mealPlanInput = document.getElementById('meal-plan-input');
        const generateMealPlanBtn = document.getElementById('generate-meal-plan-btn');
        const mealPlanOutput = document.getElementById('meal-plan-output');
        const mealPlanPlaceholder = document.getElementById('meal-plan-placeholder');
        const mealPlanLoading = document.getElementById('meal-plan-loading');
        const mealPlanContent = document.getElementById('meal-plan-content');
        const mealPlanError = document.getElementById('meal-plan-error');

        function openMealPlanModal() {
            mealPlanModal.classList.add('open');
            mealPlanInput.value = ''; // Clear input on open
            mealPlanContent.innerHTML = ''; // Clear previous meal plan
            mealPlanPlaceholder.classList.remove('hidden');
            mealPlanLoading.classList.add('hidden');
            mealPlanContent.classList.add('hidden');
            mealPlanError.classList.add('hidden');
        }

        function closeMealPlanModal() {
            mealPlanModal.classList.remove('open');
        }

        openMealPlanModalBtn.addEventListener('click', openMealPlanModal);
        closeMealPlanModalBtn.addEventListener('click', closeMealPlanModal);
        mealPlanModal.addEventListener('click', (e) => {
            if (e.target === mealPlanModal) { // Close when clicking outside the content
                closeMealPlanModal();
            }
        });

        async function generateMealPlan() {
            const preferences = mealPlanInput.value.trim();
            if (!preferences) {
                mealPlanError.textContent = 'Please enter your dietary preferences or goals.';
                mealPlanError.classList.remove('hidden');
                return;
            }

            mealPlanPlaceholder.classList.add('hidden');
            mealPlanContent.classList.add('hidden');
            mealPlanError.classList.add('hidden');
            mealPlanLoading.classList.remove('hidden');
            generateMealPlanBtn.disabled = true;

            const prompt = `Generate a healthy and balanced meal plan (e.g., 3-day plan) based on the following preferences/goals: ${preferences}.
            For each day, suggest breakfast, lunch, and dinner. Include brief descriptions for each meal.
            Format the response clearly with headings for each day and meal, and use bullet points for meal suggestions.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    mealPlanContent.innerHTML = formatTextToHtml(text); // Use generic formatter
                    mealPlanContent.classList.remove('hidden');
                } else {
                    mealPlanError.textContent = 'Failed to generate meal plan. Please try again.';
                    mealPlanError.classList.remove('hidden');
                    console.error('Gemini API response structure unexpected:', result);
                }
            } catch (error) {
                mealPlanError.textContent = 'An error occurred while generating the meal plan. Please check your network or try again later.';
                mealPlanError.classList.remove('hidden');
                console.error('Error calling Gemini API:', error);
            } finally {
                mealPlanLoading.classList.add('hidden');
                generateMealPlanBtn.disabled = false;
            }
        }
        generateMealPlanBtn.addEventListener('click', generateMealPlan);

        // Helper function to format plain text into HTML with basic markdown support (reused for both)
        function formatTextToHtml(text) {
            let html = text;
            // Convert headings
            html = html.replace(/### (.*)/g, '<h3>$1</h3>'); // h3
            html = html.replace(/## (.*)/g, '<h2>$1</h2>'); // h2
            html = html.replace(/# (.*)/g, '<h1>$1</h1>');   // h1
            // Convert bold and italic
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bold
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');     // italic
            // Convert bullet points
            html = html.replace(/^- (.*)/gm, '<li>$1</li>');
            // Wrap lists in ul
            html = html.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>');
            // Convert double newlines to paragraphs, handle single newlines as breaks within paragraphs
            html = html.split('\n\n').map(p => {
                // If it's already an HTML tag (like ul/li), don't wrap in p
                if (p.trim().startsWith('<h') || p.trim().startsWith('<ul') || p.trim().startsWith('<li')) {
                    return p;
                }
                return `<p>${p.replace(/\n/g, '<br>')}</p>`;
            }).join('');


            return html;
        }