export interface Product {
id: number | string;
title: string;
description: string;
category?: string;
image?: string;
liked?: boolean;
created?: boolean;
deleted?: boolean;
}