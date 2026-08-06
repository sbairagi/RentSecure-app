import { z } from 'zod';
import { DOCUMENT_CONSTANTS } from '../constants/documents';

export const documentNameSchema = z
  .string()
  .min(1, 'Document name is required')
  .max(255, 'Document name must be less than 255 characters')
  .regex(/^[^\\/:*?"<>|]+$/, 'Document name contains invalid characters');

export const documentUploadSchema = z.object({
  name: documentNameSchema,
  file: z
    .any()
    .refine((file) => file !== null && file !== undefined, 'File is required')
    .refine(
      (file) => {
        if (file instanceof File) return file.size <= DOCUMENT_CONSTANTS.MAX_FILE_SIZE;
        if (typeof file === 'object' && file !== null && 'size' in file)
          return (file as any).size <= DOCUMENT_CONSTANTS.MAX_FILE_SIZE;
        return true;
      },
      `File size must be less than ${DOCUMENT_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB`
    )
    .refine(
      (file) => {
        if (file instanceof File)
          return DOCUMENT_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type);
        if (typeof file === 'object' && file !== null && 'type' in file)
          return DOCUMENT_CONSTANTS.ALLOWED_MIME_TYPES.includes((file as any).type);
        return true;
      },
      'File type not supported'
    ),
  document_type: z
    .string()
    .optional()
    .default('text'),
  metadata: z.record(z.any()).optional().default({}),
});

export const documentUpdateSchema = z.object({
  name: documentNameSchema.optional(),
  parent: z.number().nullable().optional(),
  is_favorite: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const documentShareSchema = z.object({
  visibility: z.enum(['private', 'shared', 'public']),
  expires_in: z.number().positive().optional(),
});

export const documentBulkActionSchema = z.object({
  ids: z.array(z.number().or(z.string())).min(1, 'Select at least one document'),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
export type DocumentShareInput = z.infer<typeof documentShareSchema>;
export type DocumentBulkActionInput = z.infer<typeof documentBulkActionSchema>;
