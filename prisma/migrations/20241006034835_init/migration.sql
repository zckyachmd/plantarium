-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomies" (
    "id" SERIAL NOT NULL,
    "kingdom" VARCHAR(100) NOT NULL,
    "phylum" VARCHAR(100) NOT NULL,
    "class" VARCHAR(100) NOT NULL,
    "order" VARCHAR(100),
    "family" VARCHAR(100),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "varieties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "origin" VARCHAR(100) NOT NULL,
    "synonyms" TEXT[],
    "genus" VARCHAR(100) NOT NULL,
    "species" VARCHAR(100) NOT NULL,
    "taxonomyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "varieties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryVarieties" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomies_kingdom_phylum_class_order_family_key" ON "taxonomies"("kingdom", "phylum", "class", "order", "family");

-- CreateIndex
CREATE UNIQUE INDEX "varieties_name_key" ON "varieties"("name");

-- CreateIndex
CREATE INDEX "varieties_name_scientificName_idx" ON "varieties"("name", "scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryVarieties_AB_unique" ON "_CategoryVarieties"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryVarieties_B_index" ON "_CategoryVarieties"("B");

-- AddForeignKey
ALTER TABLE "varieties" ADD CONSTRAINT "varieties_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "taxonomies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryVarieties" ADD CONSTRAINT "_CategoryVarieties_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryVarieties" ADD CONSTRAINT "_CategoryVarieties_B_fkey" FOREIGN KEY ("B") REFERENCES "varieties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
