import { Product } from "@/entities/product/types/product";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ProductsState {
    items: Product[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error?: string;
    filter: "all" | "favorites";
    search: string;
    page: number;
    pageSize: number;
}

const initialState: ProductsState = {
    items: [],
    status: "idle",
    filter: "all",
    search: "",
    page: 1,
    pageSize: 12,
};

function mapDrinkToProduct(drink: any): Product {
    return {
        id: drink.idDrink,
        title: drink.strDrink,
        description: drink.strInstructions ?? "",
        category: drink.strCategory ?? undefined,
        image: drink.strDrinkThumb ?? undefined,
        liked: false,
        created: false,
        deleted: false,
    };
}

export const fetchProductsByFirstLetter = createAsyncThunk<Product[], string>(
    "products/fetchByFirstLetter",
    async (letter: string) => {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${encodeURIComponent(letter)}`;
        const res = await axios.get(url);
        const drinks: any[] = res.data?.drinks ?? [];
        return drinks.map(mapDrinkToProduct);
    }
);

export const searchProductsByName = createAsyncThunk<Product[], string>(
    "products/searchByName",
    async (query: string) => {
        if (!query) {
            return [];
        }
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
        const res = await axios.get(url);
        const drinks: any[] = res.data?.drinks ?? [];
        return drinks.map(mapDrinkToProduct);
    }
);

export const fetchProductById = createAsyncThunk<Product | undefined, string | number>(
    "products/fetchById",
    async (id) => {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(String(id))}`;
        const res = await axios.get(url);
        const drinks: any[] = res.data?.drinks ?? [];
        if (drinks.length > 0) {
            return mapDrinkToProduct(drinks[0]);
        }
        return undefined;
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        toggleLike(state, action: PayloadAction<string | number>) {
            const id = action.payload;
            const item = state.items.find((p) => p.id === id);
            if (item) {
                item.liked = !item.liked;
            }
        },
        deleteProduct(state, action: PayloadAction<string | number>) {
            const id = action.payload;
            state.items = state.items.filter((p) => p.id !== id);
        },
        addProduct(state, action: PayloadAction<Omit<Product, "id"> & { id?: string | number }>) {
            const incoming = action.payload;
            const id = incoming.id ?? `${Date.now()}`;
            const product: Product = {
                id,
                title: incoming.title,
                description: incoming.description,
                category: incoming.category,
                image: incoming.image,
                liked: false,
                created: true,
                deleted: false,
            };
            state.items.unshift(product);
        },
        updateProduct(state, action: PayloadAction<Product>) {
            const idx = state.items.findIndex((p) => p.id === action.payload.id);
            if (idx !== -1) {
                state.items[idx] = { ...state.items[idx], ...action.payload };
            }
        },
        setFilter(state, action: PayloadAction<"all" | "favorites">) {
            state.filter = action.payload;
            state.page = 1;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
            state.page = 1;
        },
        ingestIfMissing(state, action: PayloadAction<Product>) {
            const exists = state.items.some((p) => p.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFirstLetter.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
            })
            .addCase(fetchProductsByFirstLetter.fulfilled, (state, action) => {
                state.status = "succeeded";
                const incoming = action.payload;
                const map = new Map<string | number, Product>();
                for (const p of state.items) map.set(p.id, p);
                for (const p of incoming) {
                    if (!map.has(p.id)) map.set(p.id, p);
                }
                state.items = Array.from(map.values());
            })
            .addCase(fetchProductsByFirstLetter.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(searchProductsByName.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
            })
            .addCase(searchProductsByName.fulfilled, (state, action) => {
                state.status = "succeeded";
                const created = state.items.filter((p) => p.created);
                const remote = action.payload;
                state.items = [...created, ...remote.filter((r) => !created.some((c) => c.id === r.id))];
            })
            .addCase(searchProductsByName.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                if (action.payload) {
                    const exists = state.items.some((p) => p.id === action.payload!.id);
                    if (!exists) {
                        state.items.push(action.payload);
                    }
                }
            });
    },
});

export const {
    toggleLike,
    deleteProduct,
    addProduct,
    updateProduct,
    setFilter,
    setSearch,
    setPage,
    setPageSize,
    ingestIfMissing,
} = productsSlice.actions;

export default productsSlice.reducer;