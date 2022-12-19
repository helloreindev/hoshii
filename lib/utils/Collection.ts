export default class Collection<K, V> extends Map<K, V> {
    /** If this collection is empty. */
    public get empty(): boolean {
        return this.size === 0;
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array#every } */
    public every<T extends V, ThisArg = Collection<K, V>>(
        predicate: (value: V, index: number, array: Array<V>) => value is T,
        thisArg?: ThisArg
    ): this is Array<T>;

    public every<ThisArg = Collection<K, V>>(
        predicate: (value: V, index: number, array: Array<V>) => unknown,
        thisArg?: ThisArg
    ): boolean;

    public every(
        predicate: (value: V, index: number, array: Array<V>) => unknown,
        thisArg?: unknown
    ): boolean {
        return this.toArray().every(predicate, thisArg);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array#filter } */
    public filter<S extends V, ThisArg = Collection<K, V>>(
        predicate: (
            this: ThisArg,
            value: V,
            index: number,
            array: Array<V>
        ) => value is S,
        thisArg?: ThisArg
    ): Array<S>;

    public filter<ThisArg = Collection<K, V>>(
        predicate: (
            this: ThisArg,
            value: V,
            index: number,
            array: Array<V>
        ) => unknown,
        thisArg?: ThisArg
    ): Array<V>;

    public filter(
        predicate: (value: V, index: number, array: Array<V>) => unknown,
        thisArg?: unknown
    ): Array<V> {
        return this.toArray().filter(predicate, thisArg);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | Array#find } */
    public find<S extends V, ThisArg = Collection<K, V>>(
        predicate: (
            this: ThisArg,
            value: V,
            index: number,
            obj: Array<V>
        ) => value is S,
        thisArg?: ThisArg
    ): S | undefined;

    public find<ThisArg = Collection<K, V>>(
        predicate: (
            this: ThisArg,
            value: V,
            index: number,
            obj: Array<V>
        ) => unknown,
        thisArg?: ThisArg
    ): V | undefined;

    public find(
        predicate: (value: V, index: number, obj: Array<V>) => unknown,
        thisArg?: unknown
    ): V | undefined {
        return this.toArray().find(predicate, thisArg);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex | Array#findIndex } */
    public findIndex(
        predicate: (value: V, index: number, obj: Array<V>) => unknown,
        thisArg?: unknown
    ): number {
        return this.toArray().findIndex(predicate, thisArg);
    }

    /**
     * Get the first element, or first X elements if a number is provided.
     * @param amount The amount of elements to get.
     */
    public first(): V | undefined;

    public first(amount: number): Array<V>;

    public first(amount?: number): V | Array<V> | undefined {
        if (typeof amount === "undefined") {
            const iterable = this.values();
            return iterable.next().value as V;
        }

        if (amount < 0) {
            return this.last(amount * -1);
        }

        amount = Math.min(amount, this.size);

        const iterable = this.values();
        return Array.from({ length: amount }, () => iterable.next().value as V);
    }

    /**
     * Get the last element, or last X elements if a number is provided.
     * @param amount The amount of elements to get.
     */
    public last(): V | undefined;

    public last(amount: number): Array<V>;

    public last(amount?: number): V | Array<V> | undefined {
        const iterator = Array.from(this.values());

        if (typeof amount === "undefined") {
            return iterator[iterator.length - 1];
        }

        if (amount < 0) {
            return this.first(amount * -1);
        }

        if (!amount) {
            return [];
        }

        return iterator.slice(-amount);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array#map } */
    public map<T>(
        predicate: (value: V, index: number, obj: Array<V>) => T,
        thisArg?: unknown
    ): Array<T> {
        return this.toArray().map(predicate, thisArg);
    }

    /**
     * Pick a random element from the collection, or undefined if the collection is empty.
     */
    public random(): V | undefined {
        if (this.empty) {
            return undefined;
        }

        const iterable = Array.from(this.values());

        return iterable[Math.floor(Math.random() * iterable.length)];
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce | Array#reduce } */
    public reduce(
        predicate: (
            previousValue: V,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => V
    ): V;

    public reduce(
        predicate: (
            previousValue: V,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => V,
        initialValue: V
    ): V;

    public reduce<T>(
        predicate: (
            previousValue: T,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => T,
        initialValue: T
    ): T;

    public reduce<T>(
        predicate: (
            previousValue: T,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => T,
        initialValue?: T
    ): T {
        return this.toArray().reduce(predicate, initialValue!);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight | Array#reduceRight } */
    public reduceRight(
        predicate: (
            previousValue: V,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => V
    ): V;

    public reduceRight(
        predicate: (
            previousValue: V,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => V,
        initialValue: V
    ): V;

    public reduceRight<T>(
        predicate: (
            previousValue: T,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => T,
        initialValue: T
    ): T;

    public reduceRight<T>(
        predicate: (
            previousValue: T,
            currentValue: V,
            currentIndex: number,
            array: Array<V>
        ) => T,
        initialValue?: T
    ): T {
        return this.toArray().reduceRight(predicate, initialValue!);
    }

    /** See: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array#some } */
    public some<ThisArg = Collection<K, V>>(
        predicate: (value: V, index: number, array: Array<V>) => unknown,
        thisArg?: ThisArg
    ): boolean {
        return this.toArray().some(predicate, thisArg);
    }

    /** Get the values of this collection as an array. */
    public toArray(): Array<V> {
        return Array.from(this.values());
    }
}
