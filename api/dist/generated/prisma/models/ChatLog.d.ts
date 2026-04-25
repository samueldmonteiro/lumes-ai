import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ChatLogModel = runtime.Types.Result.DefaultSelection<Prisma.$ChatLogPayload>;
export type AggregateChatLog = {
    _count: ChatLogCountAggregateOutputType | null;
    _avg: ChatLogAvgAggregateOutputType | null;
    _sum: ChatLogSumAggregateOutputType | null;
    _min: ChatLogMinAggregateOutputType | null;
    _max: ChatLogMaxAggregateOutputType | null;
};
export type ChatLogAvgAggregateOutputType = {
    id: number | null;
    similarity: number | null;
};
export type ChatLogSumAggregateOutputType = {
    id: number | null;
    similarity: number | null;
};
export type ChatLogMinAggregateOutputType = {
    id: number | null;
    question: string | null;
    answer: string | null;
    similarity: number | null;
    createdAt: Date | null;
};
export type ChatLogMaxAggregateOutputType = {
    id: number | null;
    question: string | null;
    answer: string | null;
    similarity: number | null;
    createdAt: Date | null;
};
export type ChatLogCountAggregateOutputType = {
    id: number;
    question: number;
    answer: number;
    sources: number;
    similarity: number;
    createdAt: number;
    _all: number;
};
export type ChatLogAvgAggregateInputType = {
    id?: true;
    similarity?: true;
};
export type ChatLogSumAggregateInputType = {
    id?: true;
    similarity?: true;
};
export type ChatLogMinAggregateInputType = {
    id?: true;
    question?: true;
    answer?: true;
    similarity?: true;
    createdAt?: true;
};
export type ChatLogMaxAggregateInputType = {
    id?: true;
    question?: true;
    answer?: true;
    similarity?: true;
    createdAt?: true;
};
export type ChatLogCountAggregateInputType = {
    id?: true;
    question?: true;
    answer?: true;
    sources?: true;
    similarity?: true;
    createdAt?: true;
    _all?: true;
};
export type ChatLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatLogWhereInput;
    orderBy?: Prisma.ChatLogOrderByWithRelationInput | Prisma.ChatLogOrderByWithRelationInput[];
    cursor?: Prisma.ChatLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChatLogCountAggregateInputType;
    _avg?: ChatLogAvgAggregateInputType;
    _sum?: ChatLogSumAggregateInputType;
    _min?: ChatLogMinAggregateInputType;
    _max?: ChatLogMaxAggregateInputType;
};
export type GetChatLogAggregateType<T extends ChatLogAggregateArgs> = {
    [P in keyof T & keyof AggregateChatLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChatLog[P]> : Prisma.GetScalarType<T[P], AggregateChatLog[P]>;
};
export type ChatLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatLogWhereInput;
    orderBy?: Prisma.ChatLogOrderByWithAggregationInput | Prisma.ChatLogOrderByWithAggregationInput[];
    by: Prisma.ChatLogScalarFieldEnum[] | Prisma.ChatLogScalarFieldEnum;
    having?: Prisma.ChatLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChatLogCountAggregateInputType | true;
    _avg?: ChatLogAvgAggregateInputType;
    _sum?: ChatLogSumAggregateInputType;
    _min?: ChatLogMinAggregateInputType;
    _max?: ChatLogMaxAggregateInputType;
};
export type ChatLogGroupByOutputType = {
    id: number;
    question: string;
    answer: string;
    sources: runtime.JsonValue;
    similarity: number | null;
    createdAt: Date;
    _count: ChatLogCountAggregateOutputType | null;
    _avg: ChatLogAvgAggregateOutputType | null;
    _sum: ChatLogSumAggregateOutputType | null;
    _min: ChatLogMinAggregateOutputType | null;
    _max: ChatLogMaxAggregateOutputType | null;
};
export type GetChatLogGroupByPayload<T extends ChatLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChatLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChatLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChatLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChatLogGroupByOutputType[P]>;
}>>;
export type ChatLogWhereInput = {
    AND?: Prisma.ChatLogWhereInput | Prisma.ChatLogWhereInput[];
    OR?: Prisma.ChatLogWhereInput[];
    NOT?: Prisma.ChatLogWhereInput | Prisma.ChatLogWhereInput[];
    id?: Prisma.IntFilter<"ChatLog"> | number;
    question?: Prisma.StringFilter<"ChatLog"> | string;
    answer?: Prisma.StringFilter<"ChatLog"> | string;
    sources?: Prisma.JsonFilter<"ChatLog">;
    similarity?: Prisma.FloatNullableFilter<"ChatLog"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"ChatLog"> | Date | string;
};
export type ChatLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    similarity?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.ChatLogWhereInput | Prisma.ChatLogWhereInput[];
    OR?: Prisma.ChatLogWhereInput[];
    NOT?: Prisma.ChatLogWhereInput | Prisma.ChatLogWhereInput[];
    question?: Prisma.StringFilter<"ChatLog"> | string;
    answer?: Prisma.StringFilter<"ChatLog"> | string;
    sources?: Prisma.JsonFilter<"ChatLog">;
    similarity?: Prisma.FloatNullableFilter<"ChatLog"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"ChatLog"> | Date | string;
}, "id">;
export type ChatLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    similarity?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ChatLogCountOrderByAggregateInput;
    _avg?: Prisma.ChatLogAvgOrderByAggregateInput;
    _max?: Prisma.ChatLogMaxOrderByAggregateInput;
    _min?: Prisma.ChatLogMinOrderByAggregateInput;
    _sum?: Prisma.ChatLogSumOrderByAggregateInput;
};
export type ChatLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChatLogScalarWhereWithAggregatesInput | Prisma.ChatLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChatLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChatLogScalarWhereWithAggregatesInput | Prisma.ChatLogScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ChatLog"> | number;
    question?: Prisma.StringWithAggregatesFilter<"ChatLog"> | string;
    answer?: Prisma.StringWithAggregatesFilter<"ChatLog"> | string;
    sources?: Prisma.JsonWithAggregatesFilter<"ChatLog">;
    similarity?: Prisma.FloatNullableWithAggregatesFilter<"ChatLog"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChatLog"> | Date | string;
};
export type ChatLogCreateInput = {
    question: string;
    answer: string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: number | null;
    createdAt?: Date | string;
};
export type ChatLogUncheckedCreateInput = {
    id?: number;
    question: string;
    answer: string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: number | null;
    createdAt?: Date | string;
};
export type ChatLogUpdateInput = {
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatLogUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatLogCreateManyInput = {
    id?: number;
    question: string;
    answer: string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: number | null;
    createdAt?: Date | string;
};
export type ChatLogUpdateManyMutationInput = {
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatLogUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    sources?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    similarity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    similarity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatLogAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    similarity?: Prisma.SortOrder;
};
export type ChatLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    similarity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    similarity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatLogSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    similarity?: Prisma.SortOrder;
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ChatLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    answer?: boolean;
    sources?: boolean;
    similarity?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["chatLog"]>;
export type ChatLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    answer?: boolean;
    sources?: boolean;
    similarity?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["chatLog"]>;
export type ChatLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    answer?: boolean;
    sources?: boolean;
    similarity?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["chatLog"]>;
export type ChatLogSelectScalar = {
    id?: boolean;
    question?: boolean;
    answer?: boolean;
    sources?: boolean;
    similarity?: boolean;
    createdAt?: boolean;
};
export type ChatLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "question" | "answer" | "sources" | "similarity" | "createdAt", ExtArgs["result"]["chatLog"]>;
export type $ChatLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChatLog";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        question: string;
        answer: string;
        sources: runtime.JsonValue;
        similarity: number | null;
        createdAt: Date;
    }, ExtArgs["result"]["chatLog"]>;
    composites: {};
};
export type ChatLogGetPayload<S extends boolean | null | undefined | ChatLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChatLogPayload, S>;
export type ChatLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChatLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChatLogCountAggregateInputType | true;
};
export interface ChatLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChatLog'];
        meta: {
            name: 'ChatLog';
        };
    };
    findUnique<T extends ChatLogFindUniqueArgs>(args: Prisma.SelectSubset<T, ChatLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChatLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChatLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChatLogFindFirstArgs>(args?: Prisma.SelectSubset<T, ChatLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChatLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChatLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChatLogFindManyArgs>(args?: Prisma.SelectSubset<T, ChatLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChatLogCreateArgs>(args: Prisma.SelectSubset<T, ChatLogCreateArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChatLogCreateManyArgs>(args?: Prisma.SelectSubset<T, ChatLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChatLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChatLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChatLogDeleteArgs>(args: Prisma.SelectSubset<T, ChatLogDeleteArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChatLogUpdateArgs>(args: Prisma.SelectSubset<T, ChatLogUpdateArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChatLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChatLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChatLogUpdateManyArgs>(args: Prisma.SelectSubset<T, ChatLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChatLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChatLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChatLogUpsertArgs>(args: Prisma.SelectSubset<T, ChatLogUpsertArgs<ExtArgs>>): Prisma.Prisma__ChatLogClient<runtime.Types.Result.GetResult<Prisma.$ChatLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChatLogCountArgs>(args?: Prisma.Subset<T, ChatLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChatLogCountAggregateOutputType> : number>;
    aggregate<T extends ChatLogAggregateArgs>(args: Prisma.Subset<T, ChatLogAggregateArgs>): Prisma.PrismaPromise<GetChatLogAggregateType<T>>;
    groupBy<T extends ChatLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChatLogGroupByArgs['orderBy'];
    } : {
        orderBy?: ChatLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChatLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChatLogFieldRefs;
}
export interface Prisma__ChatLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChatLogFieldRefs {
    readonly id: Prisma.FieldRef<"ChatLog", 'Int'>;
    readonly question: Prisma.FieldRef<"ChatLog", 'String'>;
    readonly answer: Prisma.FieldRef<"ChatLog", 'String'>;
    readonly sources: Prisma.FieldRef<"ChatLog", 'Json'>;
    readonly similarity: Prisma.FieldRef<"ChatLog", 'Float'>;
    readonly createdAt: Prisma.FieldRef<"ChatLog", 'DateTime'>;
}
export type ChatLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where: Prisma.ChatLogWhereUniqueInput;
};
export type ChatLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where: Prisma.ChatLogWhereUniqueInput;
};
export type ChatLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where?: Prisma.ChatLogWhereInput;
    orderBy?: Prisma.ChatLogOrderByWithRelationInput | Prisma.ChatLogOrderByWithRelationInput[];
    cursor?: Prisma.ChatLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatLogScalarFieldEnum | Prisma.ChatLogScalarFieldEnum[];
};
export type ChatLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where?: Prisma.ChatLogWhereInput;
    orderBy?: Prisma.ChatLogOrderByWithRelationInput | Prisma.ChatLogOrderByWithRelationInput[];
    cursor?: Prisma.ChatLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatLogScalarFieldEnum | Prisma.ChatLogScalarFieldEnum[];
};
export type ChatLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where?: Prisma.ChatLogWhereInput;
    orderBy?: Prisma.ChatLogOrderByWithRelationInput | Prisma.ChatLogOrderByWithRelationInput[];
    cursor?: Prisma.ChatLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatLogScalarFieldEnum | Prisma.ChatLogScalarFieldEnum[];
};
export type ChatLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatLogCreateInput, Prisma.ChatLogUncheckedCreateInput>;
};
export type ChatLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChatLogCreateManyInput | Prisma.ChatLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChatLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    data: Prisma.ChatLogCreateManyInput | Prisma.ChatLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChatLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatLogUpdateInput, Prisma.ChatLogUncheckedUpdateInput>;
    where: Prisma.ChatLogWhereUniqueInput;
};
export type ChatLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChatLogUpdateManyMutationInput, Prisma.ChatLogUncheckedUpdateManyInput>;
    where?: Prisma.ChatLogWhereInput;
    limit?: number;
};
export type ChatLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatLogUpdateManyMutationInput, Prisma.ChatLogUncheckedUpdateManyInput>;
    where?: Prisma.ChatLogWhereInput;
    limit?: number;
};
export type ChatLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where: Prisma.ChatLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatLogCreateInput, Prisma.ChatLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChatLogUpdateInput, Prisma.ChatLogUncheckedUpdateInput>;
};
export type ChatLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
    where: Prisma.ChatLogWhereUniqueInput;
};
export type ChatLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatLogWhereInput;
    limit?: number;
};
export type ChatLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatLogSelect<ExtArgs> | null;
    omit?: Prisma.ChatLogOmit<ExtArgs> | null;
};
