// utils/mockAuthService.ts (pour le développement uniquement) 
export const mockSignIn = async (email: string, password: string) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Utilisateurs de test
    const testUsers = [
      { email: 'client@example.com', password: 'password123', role: 'client' },
      { email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { email: 'restaurant@example.com', password: 'resto123', role: 'restaurant' }
    ];
    
    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { 
        data: { user: { id: '123', email: user.email, user_metadata: { role: user.role } } }, 
        error: null 
      };
    } else {
      return { 
        data: null, 
        error: { message: 'Email ou mot de passe incorrect' } 
      };
    }
  };
  