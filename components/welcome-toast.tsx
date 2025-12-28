'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=2')) {
      toast('Bienvenido al Monkya diseña tus polos y poleras con IA', {
        id: 'welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
           Crea tu propio diseño o inspírate eligiendo entre los favoritos de nuestra comunidad.
          </>
        )
      });
    }
  }, []);

  return null;
}
