/**
 * IMediaProvider — contract that any storage backend must satisfy.
 * The catalog layer interacts with MediaService, which delegates to this.
 */
export interface IMediaProvider {
  /** Upload an audio file; returns the R2 object key (e.g. "audio/tr_abc.mp3") */
  uploadAudio(songId: string, ext: string, buffer: Buffer): Promise<string>;

  /** Upload artist artwork; returns the R2 object key (e.g. "artists/ar_abc.webp") */
  uploadArtistArtwork(artistId: string, ext: string, buffer: Buffer): Promise<string>;

  /** Upload album artwork; returns the R2 object key (e.g. "albums/al_abc.webp") */
  uploadAlbumArtwork(albumId: string, ext: string, buffer: Buffer): Promise<string>;

  /** Delete an object by its key */
  deleteObject(key: string): Promise<void>;

  /** Check whether an object exists */
  objectExists(key: string): Promise<boolean>;

  /**
   * Generate a temporary signed URL for GET access to a private object.
   * @param key          The R2 object key (e.g. "audio/tr_abc.mp3")
   * @param expiresIn    Expiry in seconds (default: 3600)
   */
  getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
}
