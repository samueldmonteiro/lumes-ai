import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type KnowledgeChunkModel = runtime.Types.Result.DefaultSelection<Prisma.$KnowledgeChunkPayload>;
export type AggregateKnowledgeChunk = {
    _count: KnowledgeChunkCountAggregateOutputType | null;
    _avg: KnowledgeChunkAvgAggregateOutputType | null;
    _sum: KnowledgeChunkSumAggregateOutputType | null;
    _min: KnowledgeChunkMinAggregateOutputType | null;
    _max: KnowledgeChunkMaxAggregateOutputType | null;
};
export type KnowledgeChunkAvgAggregateOutputType = {
    id: number | null;
};
export type KnowledgeChunkSumAggregateOutputType = {
    id: number | null;
};
export type KnowledgeChunkMinAggregateOutputType = {
    id: number | null;
    content: string | null;
    category: string | null;
    source: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type KnowledgeChunkMaxAggregateOutputType = {
    id: number | null;
    content: string | null;
    category: string | null;
    source: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type KnowledgeChunkCountAggregateOutputType = {
    id: number;
    content: number;
    category: number;
    source: number;
    metadata: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type KnowledgeChunkAvgAggregateInputType = {
    id?: true;
};
export type KnowledgeChunkSumAggregateInputType = {
    id?: true;
};
export type KnowledgeChunkMinAggregateInputType = {
    id?: true;
    content?: true;
    category?: true;
    source?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type KnowledgeChunkMaxAggregateInputType = {
    id?: true;
    content?: true;
    category?: true;
    source?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type KnowledgeChunkCountAggregateInputType = {
    id?: true;
    content?: true;
    category?: true;
    source?: true;
    metadata?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type KnowledgeChunkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KnowledgeChunkWhereInput;
    orderBy?: Prisma.KnowledgeChunkOrderByWithRelationInput | Prisma.KnowledgeChunkOrderByWithRelationInput[];
    cursor?: Prisma.KnowledgeChunkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | KnowledgeChunkCountAggregateInputType;
    _avg?: KnowledgeChunkAvgAggregateInputType;
    _sum?: KnowledgeChunkSumAggregateInputType;
    _min?: KnowledgeChunkMinAggregateInputType;
    _max?: KnowledgeChunkMaxAggregateInputType;
};
export type GetKnowledgeChunkAggregateType<T extends KnowledgeChunkAggregateArgs> = {
    [P in keyof T & keyof AggregateKnowledgeChunk]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateKnowledgeChunk[P]> : Prisma.GetScalarType<T[P], AggregateKnowledgeChunk[P]>;
};
export type KnowledgeChunkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KnowledgeChunkWhereInput;
    orderBy?: Prisma.KnowledgeChunkOrderByWithAggregationInput | Prisma.KnowledgeChunkOrderByWithAggregationInput[];
    by: Prisma.KnowledgeChunkScalarFieldEnum[] | Prisma.KnowledgeChunkScalarFieldEnum;
    having?: Prisma.KnowledgeChunkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: KnowledgeChunkCountAggregateInputType | true;
    _avg?: KnowledgeChunkAvgAggregateInputType;
    _sum?: KnowledgeChunkSumAggregateInputType;
    _min?: KnowledgeChunkMinAggregateInputType;
    _max?: KnowledgeChunkMaxAggregateInputType;
};
export type KnowledgeChunkGroupByOutputType = {
    id: number;
    content: string;
    category: string;
    source: string;
    metadata: runtime.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: KnowledgeChunkCountAggregateOutputType | null;
    _avg: KnowledgeChunkAvgAggregateOutputType | null;
    _sum: KnowledgeChunkSumAggregateOutputType | null;
    _min: KnowledgeChunkMinAggregateOutputType | null;
    _max: KnowledgeChunkMaxAggregateOutputType | null;
};
export type GetKnowledgeChunkGroupByPayload<T extends KnowledgeChunkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<KnowledgeChunkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof KnowledgeChunkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]>;
}>>;
export type KnowledgeChunkWhereInput = {
    AND?: Prisma.KnowledgeChunkWhereInput | Prisma.KnowledgeChunkWhereInput[];
    OR?: Prisma.KnowledgeChunkWhereInput[];
    NOT?: Prisma.KnowledgeChunkWhereInput | Prisma.KnowledgeChunkWhereInput[];
    id?: Prisma.IntFilter<"KnowledgeChunk"> | number;
    content?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    category?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    source?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    metadata?: Prisma.JsonFilter<"KnowledgeChunk">;
    createdAt?: Prisma.DateTimeFilter<"KnowledgeChunk"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KnowledgeChunk"> | Date | string;
};
export type KnowledgeChunkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KnowledgeChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.KnowledgeChunkWhereInput | Prisma.KnowledgeChunkWhereInput[];
    OR?: Prisma.KnowledgeChunkWhereInput[];
    NOT?: Prisma.KnowledgeChunkWhereInput | Prisma.KnowledgeChunkWhereInput[];
    content?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    category?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    source?: Prisma.StringFilter<"KnowledgeChunk"> | string;
    metadata?: Prisma.JsonFilter<"KnowledgeChunk">;
    createdAt?: Prisma.DateTimeFilter<"KnowledgeChunk"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KnowledgeChunk"> | Date | string;
}, "id">;
export type KnowledgeChunkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.KnowledgeChunkCountOrderByAggregateInput;
    _avg?: Prisma.KnowledgeChunkAvgOrderByAggregateInput;
    _max?: Prisma.KnowledgeChunkMaxOrderByAggregateInput;
    _min?: Prisma.KnowledgeChunkMinOrderByAggregateInput;
    _sum?: Prisma.KnowledgeChunkSumOrderByAggregateInput;
};
export type KnowledgeChunkScalarWhereWithAggregatesInput = {
    AND?: Prisma.KnowledgeChunkScalarWhereWithAggregatesInput | Prisma.KnowledgeChunkScalarWhereWithAggregatesInput[];
    OR?: Prisma.KnowledgeChunkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.KnowledgeChunkScalarWhereWithAggregatesInput | Prisma.KnowledgeChunkScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"KnowledgeChunk"> | number;
    content?: Prisma.StringWithAggregatesFilter<"KnowledgeChunk"> | string;
    category?: Prisma.StringWithAggregatesFilter<"KnowledgeChunk"> | string;
    source?: Prisma.StringWithAggregatesFilter<"KnowledgeChunk"> | string;
    metadata?: Prisma.JsonWithAggregatesFilter<"KnowledgeChunk">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"KnowledgeChunk"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"KnowledgeChunk"> | Date | string;
};
export type KnowledgeChunkCreateInput = {
    content: string;
    category: string;
    source: string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KnowledgeChunkUncheckedCreateInput = {
    id?: number;
    content: string;
    category: string;
    source: string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KnowledgeChunkUpdateInput = {
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KnowledgeChunkUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KnowledgeChunkCreateManyInput = {
    id?: number;
    content: string;
    category: string;
    source: string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KnowledgeChunkUpdateManyMutationInput = {
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KnowledgeChunkUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KnowledgeChunkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KnowledgeChunkAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type KnowledgeChunkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KnowledgeChunkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KnowledgeChunkSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type KnowledgeChunkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    category?: boolean;
    source?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["knowledgeChunk"]>;
export type KnowledgeChunkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    category?: boolean;
    source?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["knowledgeChunk"]>;
export type KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content?: boolean;
    category?: boolean;
    source?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["knowledgeChunk"]>;
export type KnowledgeChunkSelectScalar = {
    id?: boolean;
    content?: boolean;
    category?: boolean;
    source?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type KnowledgeChunkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "content" | "category" | "source" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["knowledgeChunk"]>;
export type $KnowledgeChunkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "KnowledgeChunk";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        content: string;
        category: string;
        source: string;
        metadata: runtime.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["knowledgeChunk"]>;
    composites: {};
};
export type KnowledgeChunkGetPayload<S extends boolean | null | undefined | KnowledgeChunkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload, S>;
export type KnowledgeChunkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<KnowledgeChunkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: KnowledgeChunkCountAggregateInputType | true;
};
export interface KnowledgeChunkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeChunk'];
        meta: {
            name: 'KnowledgeChunk';
        };
    };
    findUnique<T extends KnowledgeChunkFindUniqueArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends KnowledgeChunkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends KnowledgeChunkFindFirstArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkFindFirstArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends KnowledgeChunkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends KnowledgeChunkFindManyArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends KnowledgeChunkCreateArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkCreateArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends KnowledgeChunkCreateManyArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends KnowledgeChunkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends KnowledgeChunkDeleteArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkDeleteArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends KnowledgeChunkUpdateArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkUpdateArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends KnowledgeChunkDeleteManyArgs>(args?: Prisma.SelectSubset<T, KnowledgeChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends KnowledgeChunkUpdateManyArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends KnowledgeChunkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends KnowledgeChunkUpsertArgs>(args: Prisma.SelectSubset<T, KnowledgeChunkUpsertArgs<ExtArgs>>): Prisma.Prisma__KnowledgeChunkClient<runtime.Types.Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends KnowledgeChunkCountArgs>(args?: Prisma.Subset<T, KnowledgeChunkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], KnowledgeChunkCountAggregateOutputType> : number>;
    aggregate<T extends KnowledgeChunkAggregateArgs>(args: Prisma.Subset<T, KnowledgeChunkAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeChunkAggregateType<T>>;
    groupBy<T extends KnowledgeChunkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: KnowledgeChunkGroupByArgs['orderBy'];
    } : {
        orderBy?: KnowledgeChunkGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, KnowledgeChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: KnowledgeChunkFieldRefs;
}
export interface Prisma__KnowledgeChunkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface KnowledgeChunkFieldRefs {
    readonly id: Prisma.FieldRef<"KnowledgeChunk", 'Int'>;
    readonly content: Prisma.FieldRef<"KnowledgeChunk", 'String'>;
    readonly category: Prisma.FieldRef<"KnowledgeChunk", 'String'>;
    readonly source: Prisma.FieldRef<"KnowledgeChunk", 'String'>;
    readonly metadata: Prisma.FieldRef<"KnowledgeChunk", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"KnowledgeChunk", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"KnowledgeChunk", 'DateTime'>;
}
export type KnowledgeChunkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where: Prisma.KnowledgeChunkWhereUniqueInput;
};
export type KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where: Prisma.KnowledgeChunkWhereUniqueInput;
};
export type KnowledgeChunkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where?: Prisma.KnowledgeChunkWhereInput;
    orderBy?: Prisma.KnowledgeChunkOrderByWithRelationInput | Prisma.KnowledgeChunkOrderByWithRelationInput[];
    cursor?: Prisma.KnowledgeChunkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KnowledgeChunkScalarFieldEnum | Prisma.KnowledgeChunkScalarFieldEnum[];
};
export type KnowledgeChunkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where?: Prisma.KnowledgeChunkWhereInput;
    orderBy?: Prisma.KnowledgeChunkOrderByWithRelationInput | Prisma.KnowledgeChunkOrderByWithRelationInput[];
    cursor?: Prisma.KnowledgeChunkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KnowledgeChunkScalarFieldEnum | Prisma.KnowledgeChunkScalarFieldEnum[];
};
export type KnowledgeChunkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where?: Prisma.KnowledgeChunkWhereInput;
    orderBy?: Prisma.KnowledgeChunkOrderByWithRelationInput | Prisma.KnowledgeChunkOrderByWithRelationInput[];
    cursor?: Prisma.KnowledgeChunkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KnowledgeChunkScalarFieldEnum | Prisma.KnowledgeChunkScalarFieldEnum[];
};
export type KnowledgeChunkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KnowledgeChunkCreateInput, Prisma.KnowledgeChunkUncheckedCreateInput>;
};
export type KnowledgeChunkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.KnowledgeChunkCreateManyInput | Prisma.KnowledgeChunkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KnowledgeChunkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    data: Prisma.KnowledgeChunkCreateManyInput | Prisma.KnowledgeChunkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KnowledgeChunkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KnowledgeChunkUpdateInput, Prisma.KnowledgeChunkUncheckedUpdateInput>;
    where: Prisma.KnowledgeChunkWhereUniqueInput;
};
export type KnowledgeChunkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.KnowledgeChunkUpdateManyMutationInput, Prisma.KnowledgeChunkUncheckedUpdateManyInput>;
    where?: Prisma.KnowledgeChunkWhereInput;
    limit?: number;
};
export type KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KnowledgeChunkUpdateManyMutationInput, Prisma.KnowledgeChunkUncheckedUpdateManyInput>;
    where?: Prisma.KnowledgeChunkWhereInput;
    limit?: number;
};
export type KnowledgeChunkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where: Prisma.KnowledgeChunkWhereUniqueInput;
    create: Prisma.XOR<Prisma.KnowledgeChunkCreateInput, Prisma.KnowledgeChunkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.KnowledgeChunkUpdateInput, Prisma.KnowledgeChunkUncheckedUpdateInput>;
};
export type KnowledgeChunkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
    where: Prisma.KnowledgeChunkWhereUniqueInput;
};
export type KnowledgeChunkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KnowledgeChunkWhereInput;
    limit?: number;
};
export type KnowledgeChunkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KnowledgeChunkSelect<ExtArgs> | null;
    omit?: Prisma.KnowledgeChunkOmit<ExtArgs> | null;
};
