const DELAY_MS = 500;

/**
 * Upload a book photo image file.
 * 
 * Firebase implementation plan:
 * Will use Firebase Storage ref(storage, `listings/${userId}/${file.name}`) and uploadBytesResumable.
 */
export async function uploadBookPhoto(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://placehold.co/400x500/1F5C56/FFFFFF?text=${encodeURIComponent(file.name || 'Uploaded+Book')}`);
    }, DELAY_MS);
  });
}
