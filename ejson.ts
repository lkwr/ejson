// deno-lint-ignore-file no-explicit-any

import { mapValues } from 'https://deno.land/std@0.135.0/collections/mod.ts';

export const parse = (ejson: string): any => {
    return decode(JSON.parse(ejson));
};

export const stringify = (ejson: any): string => {
    return JSON.stringify(encode(ejson));
};

// -- Encoder --

type Encoder = (
    type: Record<string, unknown>,
) => Record<string, any> | undefined;

const encoders: Array<Encoder> = [];

export const addEncoder = <T extends abstract new (...args: any) => any>(
    Class: T,
    format: (instance: InstanceType<T>) => Record<string, any>,
) => {
    encoders.push((obj) => {
        if (obj instanceof Class) {
            return format(obj as InstanceType<T>);
        }
    });
};

export const encode = (obj: any, types: Array<Encoder> = encoders): any => {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map((value) => encode(value, types));
        } else {
            for (const encoder of types) {
                const result = encoder(obj);
                if (result !== undefined) {
                    return result;
                }
            }
            return mapValues(obj, (value) => encode(value, types));
        }
    } else {
        for (const encoder of types) {
            const result = encoder(obj);
            if (result !== undefined) {
                return result;
            }
        }
        return obj;
    }
};

// -- Decoder --

type Decoder = (obj: any, key: string) => any | undefined;

const decoders: Record<string, Decoder> = {};

export const addDecoder = (
    key: string,
    decoder: (obj: Record<string, any>) => any,
) => {
    decoders[key] = decoder;
};

export const decode = (
    obj: any,
    types: Record<string, Decoder> = decoders,
): any => {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map((value) => decode(value, types));
        } else {
            const matched = Object.keys(obj).find((key) => key.startsWith('$'));

            if (matched && types[matched]) {
                return types[matched](obj[matched], matched);
            } else {
                return mapValues(obj, (value) => decode(value));
            }
        }
    } else {
        return obj;
    }
};
