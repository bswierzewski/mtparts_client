'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCcw, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { getGetContractorsQueryKey, useDeleteContractor, useGetContractors } from '@/lib/api/autodor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Contractors() {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, refetch } = useGetContractors();
  const { mutate } = useDeleteContractor({
    mutation: {
      onSuccess() {
        toast.success('Successfully removed');
        queryClient.invalidateQueries({
          queryKey: getGetContractorsQueryKey()
        });
      }
    }
  });

  const filteredContractors = data?.filter((contractor) =>
    contractor.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5">
        <Input placeholder="Search by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button size="default" onClick={() => refetch()} variant="secondary">
          <RefreshCcw />
          <span className="ml-3 inline sm:hidden">Refresh</span>
        </Button>
        <Button size="default" onClick={() => router.push('/contractors/add')}>
          <Plus />
          <span className="ml-3 inline sm:hidden">Add</span>
        </Button>
      </div>
      <Separator className="my-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">Name</TableHead>
            <TableHead className="text-right">City</TableHead>
            <TableHead className="text-right">ZipCode</TableHead>
            <TableHead className="text-right">Street</TableHead>
            <TableHead className="text-right">Nip</TableHead>
            <TableHead className="text-right">Email</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContractors?.map((contractor) => (
            <TableRow key={contractor.id}>
              <TableCell className="text-right">{contractor.name}</TableCell>
              <TableCell className="text-right">{contractor.city}</TableCell>
              <TableCell className="text-right">{contractor.zipCode}</TableCell>
              <TableCell className="text-right">{contractor.street}</TableCell>
              <TableCell className="text-right">{contractor.nip}</TableCell>
              <TableCell className="text-right">{contractor.email}</TableCell>
              <TableCell className="text-right">
                {
                  <Button
                    onClick={() =>
                      mutate({
                        data: {
                          id: contractor.id ?? ''
                        }
                      })
                    }
                    size="icon"
                    variant="destructive"
                  >
                    <Trash />
                  </Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
