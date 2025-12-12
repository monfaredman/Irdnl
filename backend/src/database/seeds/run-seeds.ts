import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from '../../config/typeorm.config';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Content, ContentType, ContentStatus } from '../../modules/content/entities/content.entity';
import { Series } from '../../modules/content/entities/series.entity';
import { Season } from '../../modules/content/entities/season.entity';
import { Episode } from '../../modules/content/entities/episode.entity';
import { VideoAsset, VideoAssetStatus } from '../../modules/video-assets/entities/video-asset.entity';
import { Subscription, SubscriptionStatus } from '../../modules/users/entities/subscription.entity';

async function runSeeds() {
  const configService = new ConfigService({
    envFilePath: ['.env.local', '.env'],
  });
  const typeOrmConfig = new TypeOrmConfigService(configService);
  const dataSource = new DataSource(typeOrmConfig.createTypeOrmOptions());

  try {
    await dataSource.initialize();
    console.log('Database connected');

    const userRepository = dataSource.getRepository(User);
    const contentRepository = dataSource.getRepository(Content);
    const seriesRepository = dataSource.getRepository(Series);
    const seasonRepository = dataSource.getRepository(Season);
    const episodeRepository = dataSource.getRepository(Episode);
    const videoAssetRepository = dataSource.getRepository(VideoAsset);
    const subscriptionRepository = dataSource.getRepository(Subscription);

    // Clear existing data (optional - comment out in production)
    // await episodeRepository.delete({});
    // await seasonRepository.delete({});
    // await seriesRepository.delete({});
    // await videoAssetRepository.delete({});
    // await contentRepository.delete({});
    // await subscriptionRepository.delete({});
    // await userRepository.delete({});

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('Passw0rd!', 10);
    let admin = await userRepository.findOne({ where: { email: 'admin@persiaplay.local' } });
    if (!admin) {
      admin = userRepository.create({
        email: 'admin@persiaplay.local',
        passwordHash: adminPasswordHash,
        name: 'Admin User',
        role: UserRole.ADMIN,
        isActive: true,
      });
      admin = await userRepository.save(admin);
      console.log('✓ Admin user created');
    }

    // Create regular users
    const user1PasswordHash = await bcrypt.hash('password123', 10);
    let user1 = await userRepository.findOne({ where: { email: 'user1@example.com' } });
    if (!user1) {
      user1 = userRepository.create({
        email: 'user1@example.com',
        passwordHash: user1PasswordHash,
        name: 'John Doe',
        role: UserRole.VIEWER,
        isActive: true,
      });
      user1 = await userRepository.save(user1);
      console.log('✓ User 1 created');
    }

    const user2PasswordHash = await bcrypt.hash('password123', 10);
    let user2 = await userRepository.findOne({ where: { email: 'user2@example.com' } });
    if (!user2) {
      user2 = userRepository.create({
        email: 'user2@example.com',
        passwordHash: user2PasswordHash,
        name: 'Jane Smith',
        role: UserRole.VIEWER,
        isActive: true,
      });
      user2 = await userRepository.save(user2);
      console.log('✓ User 2 created');
    }

    // Create 5 movies
    const movies = [
      {
        title: 'Desert Sonata',
        year: 2023,
        description: 'A captivating story set in the Persian desert.',
        posterUrl: '/images/movies/desert-sonata.svg',
        bannerUrl: '/images/movies/desert-sonata-wide.svg',
        rating: 8.5,
      },
      {
        title: 'Midnight Silk',
        year: 2022,
        description: 'A tale of mystery and intrigue.',
        posterUrl: '/images/movies/midnight-silk.svg',
        bannerUrl: '/images/movies/midnight-silk-wide.svg',
        rating: 7.8,
      },
      {
        title: 'Tehran Nights',
        year: 2023,
        description: 'The vibrant nightlife of Tehran.',
        posterUrl: '/images/movies/desert-sonata.svg',
        bannerUrl: '/images/movies/desert-sonata-wide.svg',
        rating: 8.2,
      },
      {
        title: 'Persian Dreams',
        year: 2021,
        description: 'A journey through Persian culture.',
        posterUrl: '/images/movies/midnight-silk.svg',
        bannerUrl: '/images/movies/midnight-silk-wide.svg',
        rating: 7.5,
      },
      {
        title: 'The Last Caravan',
        year: 2023,
        description: 'An epic adventure across the Silk Road.',
        posterUrl: '/images/movies/desert-sonata.svg',
        bannerUrl: '/images/movies/desert-sonata-wide.svg',
        rating: 9.0,
      },
    ];

    const createdMovies = [];
    for (const movieData of movies) {
      let movie = await contentRepository.findOne({ where: { title: movieData.title } });
      if (!movie) {
        movie = contentRepository.create({
          ...movieData,
          type: ContentType.MOVIE,
          status: ContentStatus.PUBLISHED,
          licenseInfo: {
            distributor: 'PersiaPlay Studios',
            licenseDate: new Date().toISOString(),
          },
        });
        movie = await contentRepository.save(movie);
        createdMovies.push(movie);
        console.log(`✓ Movie "${movieData.title}" created`);
      } else {
        createdMovies.push(movie);
      }
    }

    // Create one series with 2 seasons and 3 episodes each
    let seriesContent = await contentRepository.findOne({ where: { title: 'Shadows of Isfahan' } });
    if (!seriesContent) {
      seriesContent = contentRepository.create({
        title: 'Shadows of Isfahan',
        type: ContentType.SERIES,
        year: 2023,
        description: 'A gripping series set in historic Isfahan.',
        posterUrl: '/images/series/shadows-of-isfahan.svg',
        bannerUrl: '/images/series/shadows-of-isfahan-wide.svg',
        rating: 8.7,
        status: ContentStatus.PUBLISHED,
        licenseInfo: {
          distributor: 'PersiaPlay Studios',
          licenseDate: new Date().toISOString(),
        },
      });
      seriesContent = await contentRepository.save(seriesContent);
      console.log('✓ Series content created');

      const series = seriesRepository.create({
        contentId: seriesContent.id,
      });
      const savedSeries = await seriesRepository.save(series);
      console.log('✓ Series entity created');

      // Create 2 seasons
      for (let seasonNum = 1; seasonNum <= 2; seasonNum++) {
        const season = seasonRepository.create({
          seriesId: savedSeries.id,
          number: seasonNum,
          title: `Season ${seasonNum}`,
        });
        const savedSeason = await seasonRepository.save(season);
        console.log(`✓ Season ${seasonNum} created`);

        // Create 3 episodes per season
        for (let epNum = 1; epNum <= 3; epNum++) {
          // Create video asset for episode
          const videoAsset = videoAssetRepository.create({
            contentId: seriesContent.id,
            quality: '1080p',
            status: VideoAssetStatus.READY,
            hlsUrl: `http://localhost:9000/media/content${seriesContent.id}/1080p/playlist.m3u8`,
            duration: 3600, // 1 hour
            filesize: 1073741824, // 1 GB
          });
          const savedAsset = await videoAssetRepository.save(videoAsset);

          const episode = episodeRepository.create({
            seasonId: savedSeason.id,
            title: `Episode ${epNum}`,
            number: epNum,
            description: `Episode ${epNum} of Season ${seasonNum}`,
            videoAssetId: savedAsset.id,
          });
          await episodeRepository.save(episode);
          console.log(`✓ Episode S${seasonNum}E${epNum} created`);
        }
      }
    }

    // Create subscription for user1
    let subscription = await subscriptionRepository.findOne({
      where: { userId: user1.id },
    });
    if (!subscription) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

      subscription = subscriptionRepository.create({
        userId: user1.id,
        plan: 'premium',
        status: SubscriptionStatus.ACTIVE,
        expiresAt,
      });
      await subscriptionRepository.save(subscription);
      console.log('✓ Subscription created for user1');
    }

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@persiaplay.local / Passw0rd!');
    console.log('User 1: user1@example.com / password123');
    console.log('User 2: user2@example.com / password123');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

runSeeds();

