import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../src/config/typeorm.config';
import { Category } from '../src/modules/content/entities/category.entity';
import { Genre } from '../src/modules/content/entities/genre.entity';
import { config as loadEnvConfig } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

loadEnvConfig();
loadEnvConfig({ path: '.env.local', override: true });

async function exportCategoriesAndGenres() {
  const configLike = {
    get<T = any>(key: string, defaultValue?: T): T {
      return (process.env[key] ?? defaultValue) as T;
    },
  };

  const dataSource = new DataSource({
    ...buildTypeOrmOptions(configLike),
    entities: [Category, Genre],
  } as any);

  await dataSource.initialize();
  console.log('🔌 Database connected for export');

  const categoryRepo = dataSource.getRepository(Category);
  const genreRepo = dataSource.getRepository(Genre);

  // Fetch all categories
  const categories = await categoryRepo.find({
    order: { sortOrder: 'ASC', id: 'ASC' },
  });

  // Fetch all genres
  const genres = await genreRepo.find({
    order: { sortOrder: 'ASC', id: 'ASC' },
  });

  console.log(`\n📊 Found ${categories.length} categories and ${genres.length} genres`);

  // Separate parents and children
  const parents = categories.filter((c) => !c.parentId);
  const children = categories.filter((c) => c.parentId);

  // Build export data
  const exportData = {
    exportedAt: new Date().toISOString(),
    categories: {
      parents: parents.map((c) => ({
        slug: c.slug,
        nameEn: c.nameEn,
        nameFa: c.nameFa,
        contentType: c.contentType,
        descriptionEn: c.descriptionEn,
        descriptionFa: c.descriptionFa,
        gradientColors: c.gradientColors,
        showInMenu: c.showInMenu,
        showInLanding: c.showInLanding,
        showEpisodes: c.showEpisodes,
        isActive: c.isActive,
        sortOrder: c.sortOrder,
        urlPath: c.urlPath,
        tmdbParams: c.tmdbParams,
      })),
      children: children.map((c) => {
        const parent = categories.find((p) => p.id === c.parentId);
        return {
          slug: c.slug,
          nameEn: c.nameEn,
          nameFa: c.nameFa,
          parentSlug: parent?.slug || null,
          contentType: c.contentType,
          descriptionEn: c.descriptionEn,
          descriptionFa: c.descriptionFa,
          gradientColors: c.gradientColors,
          showInMenu: c.showInMenu,
          showInLanding: c.showInLanding,
          showEpisodes: c.showEpisodes,
          isActive: c.isActive,
          sortOrder: c.sortOrder,
          urlPath: c.urlPath,
          tmdbParams: c.tmdbParams,
        };
    }),
  },
  genres: genres.map((g) => ({
    slug: g.slug,
    nameEn: g.nameEn,
    nameFa: g.nameFa,
    tmdbGenreId: g.tmdbGenreId,
    categorySlugs: g.categorySlugs,
    posterUrl: g.posterUrl,
    logoUrl: g.logoUrl,
    backdropUrl: g.backdropUrl,
    sortOrder: g.sortOrder,
    isActive: g.isActive,
  })),
};  // Save to JSON file
  const outputPath = path.join(__dirname, '../src/database/seeds/exported-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`\n✅ Exported to: ${outputPath}`);

  // Generate TypeScript seed file
  const seedContent = generateSeedFile(exportData);
  const seedPath = path.join(__dirname, '../src/database/seeds/seed-categories-genres.ts');
  fs.writeFileSync(seedPath, seedContent, 'utf-8');
  console.log(`✅ Generated seed file: ${seedPath}`);

  console.log('\n📋 Summary:');
  console.log(`   • ${parents.length} parent categories`);
  console.log(`   • ${children.length} child categories`);
  console.log(`   • ${genres.length} genres`);

  await dataSource.destroy();
}

function generateSeedFile(data: any): string {
  return `import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../../config/typeorm.config';
import { Category } from '../../modules/content/entities/category.entity';
import { Genre } from '../../modules/content/entities/genre.entity';
import { config as loadEnvConfig } from 'dotenv';

loadEnvConfig();
loadEnvConfig({ path: '.env.local', override: true });

/**
 * Seed categories and genres
 * Auto-generated on ${data.exportedAt}
 * 
 * Categories: ${data.categories.parents.length} parents, ${data.categories.children.length} children
 * Genres: ${data.genres.length} total
 */
async function seedCategoriesAndGenres() {
  const configLike = {
    get<T = any>(key: string, defaultValue?: T): T {
      return (process.env[key] ?? defaultValue) as T;
    },
  };

  const dataSource = new DataSource({
    ...buildTypeOrmOptions(configLike),
    entities: [Category, Genre],
  } as any);

  await dataSource.initialize();
  console.log('🔌 Database connected for seeding');

  const categoryRepo = dataSource.getRepository(Category);
  const genreRepo = dataSource.getRepository(Genre);

  // ========================================================================
  // GENRES
  // ========================================================================
  console.log('\\n📚 Seeding genres...');
  
  const genresData = ${JSON.stringify(data.genres, null, 2)};

  for (const genreData of genresData) {
    let existing = await genreRepo.findOne({ where: { slug: genreData.slug } });
    if (existing) {
      Object.assign(existing, genreData);
      await genreRepo.save(existing);
      console.log(\`  ✅ Updated: \${genreData.nameFa} (\${genreData.slug})\`);
    } else {
      const genre = genreRepo.create(genreData);
      await genreRepo.save(genre);
      console.log(\`  ✅ Created: \${genreData.nameFa} (\${genreData.slug})\`);
    }
  }

  // ========================================================================
  // PARENT CATEGORIES
  // ========================================================================
  console.log('\\n📁 Seeding parent categories...');
  
  const parentsData = ${JSON.stringify(data.categories.parents, null, 2)};

  const savedParents: Record<string, Category> = {};
  for (const parentData of parentsData) {
    let existing = await categoryRepo.findOne({ where: { slug: parentData.slug } });
    if (existing) {
      Object.assign(existing, parentData);
      savedParents[parentData.slug] = await categoryRepo.save(existing);
      console.log(\`  ✅ Updated: \${parentData.nameFa} (\${parentData.slug})\`);
    } else {
      const cat = categoryRepo.create(parentData);
      savedParents[parentData.slug] = await categoryRepo.save(cat);
      console.log(\`  ✅ Created: \${parentData.nameFa} (\${parentData.slug})\`);
    }
  }

  // ========================================================================
  // CHILD CATEGORIES
  // ========================================================================
  console.log('\\n📂 Seeding child categories...');
  
  const childrenData = ${JSON.stringify(data.categories.children, null, 2)};

  for (const childData of childrenData) {
    const parent = savedParents[childData.parentSlug];
    if (!parent) {
      console.warn(\`  ⚠️  Parent "\${childData.parentSlug}" not found for \${childData.slug}, skipping\`);
      continue;
    }

    const fullChild = {
      ...childData,
      parentId: parent.id,
    };
    delete (fullChild as any).parentSlug; // Remove temporary field

    let existing = await categoryRepo.findOne({ where: { slug: childData.slug } });
    if (existing) {
      Object.assign(existing, fullChild);
      await categoryRepo.save(existing);
      console.log(\`    └─ Updated: \${childData.nameFa} (\${childData.slug}) → parent: \${parent.slug}\`);
    } else {
      const cat = categoryRepo.create(fullChild);
      await categoryRepo.save(cat);
      console.log(\`    └─ Created: \${childData.nameFa} (\${childData.slug}) → parent: \${parent.slug}\`);
    }
  }

  console.log('\\n🎉 Seeding complete!');
  console.log(\`   • \${parentsData.length} parent categories\`);
  console.log(\`   • \${childrenData.length} child categories\`);
  console.log(\`   • \${genresData.length} genres\`);

  await dataSource.destroy();
}

seedCategoriesAndGenres().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
`;
}

exportCategoriesAndGenres().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
