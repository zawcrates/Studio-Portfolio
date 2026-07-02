'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidates the homepage cache.
 */
export async function revalidateHome() {
  revalidatePath('/');
}

/**
 * Revalidates the portfolio overview page and specific album pages.
 * @param slug Optional album slug to revalidate.
 */
export async function revalidatePortfolio(slug?: string) {
  revalidatePath('/portfolio');
  if (slug) {
    revalidatePath(`/portfolio/${slug}`);
  }
  revalidatePath('/'); // Albums are also displayed on the homepage
}

/**
 * Revalidates the services page cache.
 */
export async function revalidateServices() {
  revalidatePath('/services');
  revalidatePath('/'); // Services might be referenced on the homepage
}
