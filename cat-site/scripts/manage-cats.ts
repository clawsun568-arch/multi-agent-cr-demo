#!/usr/bin/env node

/**
 * manage-cats.ts — Interactive CLI for managing cat-data.json
 *
 * Usage: npx tsx scripts/manage-cats.ts
 *    or: npm run cats
 *
 * Menu:
 *   1. List cats
 *   2. Add cat
 *   3. Edit cat
 *   4. Remove cat
 *   5. Exit
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

const DATA_PATH = resolve(import.meta.dirname ?? '.', '../public/cat-data.json');

interface Photo {
  url: string;
  caption?: string;
}

interface Cat {
  id: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  status: 'owned' | 'planned';
  role?: 'king' | 'queen' | 'kitten';
  color?: string;
  photoUrl: string;
  gallery?: Photo[];
  birthDate?: string;
  expectedDate?: string;
  personality?: string;
  available?: boolean;
  father?: string;
  mother?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CatData {
  siteConfig: Record<string, unknown>;
  cats: Cat[];
}

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function loadData(): CatData {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveData(data: CatData): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
}

function listCats(cats: Cat[]): void {
  if (cats.length === 0) {
    console.log('\n  No cats found.\n');
    return;
  }
  console.log('\n  Cats:');
  for (const cat of cats) {
    const role = cat.role ? ` (${cat.role})` : '';
    console.log(`    - ${cat.name} [${cat.id}] — ${cat.breed}, ${cat.gender}${role}`);
  }
  console.log('');
}

async function addCat(data: CatData): Promise<void> {
  console.log('\n  Add a new cat\n');

  const name = await ask('  Name: ');
  if (!name.trim()) {
    console.log('  Cancelled — name is required.\n');
    return;
  }

  const id = name.trim().toLowerCase().replace(/\s+/g, '-');
  if (data.cats.some((c) => c.id === id)) {
    console.log(`  A cat with id "${id}" already exists.\n`);
    return;
  }

  const breed = (await ask('  Breed: ')).trim() || 'Unknown';
  const genderInput = (await ask('  Gender (Male/Female): ')).trim();
  const gender: 'Male' | 'Female' = genderInput === 'Female' ? 'Female' : 'Male';

  const roleInput = (await ask('  Role (king/queen/kitten): ')).trim().toLowerCase();
  const role = (['king', 'queen', 'kitten'].includes(roleInput)
    ? roleInput
    : undefined) as Cat['role'];

  const color = (await ask('  Color: ')).trim() || undefined;
  const photoUrl = (await ask('  Photo URL (local path or Cloudinary URL): ')).trim() || '';
  const personality = (await ask('  Personality: ')).trim() || undefined;

  const now = new Date().toISOString();
  const cat: Cat = {
    id,
    name: name.trim(),
    breed,
    gender,
    status: 'owned',
    role,
    color,
    photoUrl,
    personality,
    createdAt: now,
    updatedAt: now,
  };

  data.cats.push(cat);
  saveData(data);
  console.log(`\n  Added "${cat.name}" (${cat.id}).\n`);
}

async function editCat(data: CatData): Promise<void> {
  listCats(data.cats);
  const id = (await ask('  Enter cat ID to edit: ')).trim();
  const cat = data.cats.find((c) => c.id === id);
  if (!cat) {
    console.log(`  Cat "${id}" not found.\n`);
    return;
  }

  console.log(`\n  Editing ${cat.name} — press Enter to keep current value.\n`);

  const name = (await ask(`  Name [${cat.name}]: `)).trim();
  if (name) cat.name = name;

  const breed = (await ask(`  Breed [${cat.breed}]: `)).trim();
  if (breed) cat.breed = breed;

  const color = (await ask(`  Color [${cat.color ?? ''}]: `)).trim();
  if (color) cat.color = color;

  const photoUrl = (await ask(`  Photo URL [${cat.photoUrl}]: `)).trim();
  if (photoUrl) cat.photoUrl = photoUrl;

  const personality = (await ask(`  Personality [${cat.personality ?? ''}]: `)).trim();
  if (personality) cat.personality = personality;

  cat.updatedAt = new Date().toISOString();
  saveData(data);
  console.log(`\n  Updated "${cat.name}".\n`);
}

async function removeCat(data: CatData): Promise<void> {
  listCats(data.cats);
  const id = (await ask('  Enter cat ID to remove: ')).trim();
  const index = data.cats.findIndex((c) => c.id === id);
  if (index === -1) {
    console.log(`  Cat "${id}" not found.\n`);
    return;
  }

  const confirm = await ask(`  Remove "${data.cats[index].name}"? (y/N): `);
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('  Cancelled.\n');
    return;
  }

  const [removed] = data.cats.splice(index, 1);
  saveData(data);
  console.log(`\n  Removed "${removed.name}".\n`);
}

async function main(): Promise<void> {
  console.log('\n  Cat Data Manager\n');

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log('  1. List cats');
    console.log('  2. Add cat');
    console.log('  3. Edit cat');
    console.log('  4. Remove cat');
    console.log('  5. Exit\n');

    const choice = (await ask('  Choose an option: ')).trim();
    const data = loadData();

    switch (choice) {
      case '1':
        listCats(data.cats);
        break;
      case '2':
        await addCat(data);
        break;
      case '3':
        await editCat(data);
        break;
      case '4':
        await removeCat(data);
        break;
      case '5':
        console.log('  Bye!\n');
        rl.close();
        return;
      default:
        console.log('  Invalid option.\n');
    }
  }
}

main();
